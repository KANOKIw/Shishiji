# Open specific files on startup

## setting

* command palette
    create config file:
    `ofos.createConfigFIle`

* config file
    .vscode/ofos.json:
    ```js
    {
        // whether feature is enabled
        "enabled": true,
        "startupfiles": [
            "app.ts",
            // open all files within the directory
            "src/main/*",
            // exclude server dir, app dir, user/control dir
            "src/sub/*^[server app user/control]"
            // exclude all child directory
            "test/*^[*]",
            ...
        ]
    }
    ```
