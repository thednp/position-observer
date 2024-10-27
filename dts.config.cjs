const config = {
  compilationOptions: {
		preferredConfigPath: './tsconfig.json',
	},
  entries: [
    {
      filePath: "src/index.ts",
      outFile: `dist/index.d.ts`,
      output: {
        umdModuleName: 'PotitionObserver',
        noBanner: true,
      }
    },
  ],
};

module.exports = config;
