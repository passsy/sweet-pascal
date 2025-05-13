# Publishing the Sweet Pascal Extension

## Packaging and Publishing

1. Update the version in `package.json`:

   ```json
   "version": "x.x.x"
   ```

2. Publish the extension:

   ```
   vsce publish
   ```

   This will automatically:

   - Run the `vscode:prepublish` script (which compiles TypeScript to JavaScript)
   - Build and package the extension into a `.vsix` file
   - Publish the package to the VS Code Marketplace

   Alternatively, if you want to create the package without publishing:

   ```
   vsce package
   ```

   This will create a `.vsix` file in your project directory.

3. Test the packaged extension:

   ```
   code --install-extension sweet-pascal-x.x.x.vsix
   ```

4. Create a git tag for the release:
   ```
   git tag v0.0.x
   git push origin v0.0.x
   ```

## Troubleshooting

If you encounter issues during the publishing process:

- Ensure you have the latest version of vsce installed
- Verify your PAT has not expired and has the correct permissions
- Check the [VS Code Extension Publishing documentation](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) for updates
- If facing "Missing repository" warnings, ensure your package.json has a valid repository URL
