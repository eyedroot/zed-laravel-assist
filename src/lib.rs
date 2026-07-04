use std::{env, fs};

use zed_extension_api::{self as zed, LanguageServerId, Result};

const SERVER_ID: &str = "laravel-assist";
const LOCAL_SERVER_PATH: &str = "server/dist/index.js";

struct LaravelAssistExtension {
    cached_server_path: Option<String>,
}

impl LaravelAssistExtension {
    fn local_server_exists(&self) -> bool {
        fs::metadata(LOCAL_SERVER_PATH).is_ok_and(|stat| stat.is_file())
    }

    fn local_server_path(&mut self) -> Result<String> {
        if let Some(path) = &self.cached_server_path {
            if self.local_server_exists() {
                return Ok(path.clone());
            }
        }

        if !self.local_server_exists() {
            return Err(format!(
                "Laravel Assist language server is not built. Run `cd server && npm install && npm run build`, then restart Zed. Expected `{LOCAL_SERVER_PATH}`."
            ));
        }

        let path = env::current_dir()
            .map_err(|error| format!("failed to resolve extension directory: {error}"))?
            .join(LOCAL_SERVER_PATH)
            .to_string_lossy()
            .to_string();

        self.cached_server_path = Some(path.clone());
        Ok(path)
    }
}

impl zed::Extension for LaravelAssistExtension {
    fn new() -> Self {
        Self {
            cached_server_path: None,
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
            args: vec![self.local_server_path()?, "--stdio".to_string()],
            env: Default::default(),
        })
    }
}

zed::register_extension!(LaravelAssistExtension);

