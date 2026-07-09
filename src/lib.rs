use std::{env, path::PathBuf};

use zed_extension_api::settings::LspSettings;
use zed_extension_api::{self as zed, LanguageServerId, Result};

const SERVER_ID: &str = "laravel-assist";
const SERVER_FILE_NAME: &str = "laravel-assist-server-v0.0.1.cjs";
const SERVER_DOWNLOAD_URL: &str =
    "https://raw.githubusercontent.com/eyedroot/zed-laravel-assist/laravel-assist-server-v0.0.1/laravel-assist-server.cjs";

struct LaravelAssistExtension {
    cached_server_script_path: Option<String>,
}

impl LaravelAssistExtension {
    fn server_script_path(&mut self, language_server_id: &LanguageServerId) -> Result<String> {
        if let Some(path) = &self.cached_server_script_path {
            return Ok(path.clone());
        }

        let script_path = PathBuf::from(
            env::current_dir()
                .map_err(|error| format!("failed to resolve extension work directory: {error}"))?,
        )
        .join(SERVER_FILE_NAME);

        if !script_path.is_file() {
            zed::set_language_server_installation_status(
                language_server_id,
                &zed::LanguageServerInstallationStatus::Downloading,
            );
            zed::download_file(
                SERVER_DOWNLOAD_URL,
                SERVER_FILE_NAME,
                zed::DownloadedFileType::Uncompressed,
            )?;
        }

        let script_path = script_path.to_string_lossy().to_string();

        self.cached_server_script_path = Some(script_path.clone());
        Ok(script_path)
    }
}

impl zed::Extension for LaravelAssistExtension {
    fn new() -> Self {
        Self {
            cached_server_script_path: None,
        }
    }

    fn language_server_command(
        &mut self,
        language_server_id: &LanguageServerId,
        _worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        if language_server_id.as_ref() != SERVER_ID {
            return Err(format!("unknown language server id: {language_server_id}"));
        }

        Ok(zed::Command {
            command: zed::node_binary_path()?,
            args: vec![self.server_script_path(language_server_id)?, "--stdio".to_string()],
            env: Default::default(),
        })
    }

    // Forward the user's `lsp.laravel-assist.initialization_options` from Zed
    // settings to the language server. This is how feature toggles such as
    // `{ "implementations": { "enabled": false } }` reach the server, which
    // reads them from the LSP `initialize` request.
    fn language_server_initialization_options(
        &mut self,
        language_server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<Option<zed::serde_json::Value>> {
        Ok(LspSettings::for_worktree(language_server_id.as_ref(), worktree)?.initialization_options)
    }
}

zed::register_extension!(LaravelAssistExtension);
