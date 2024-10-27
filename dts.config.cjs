const config = {
  compilationOptions: {
		preferredConfigPath: './tsconfig.json',
	},
  entries: [
    {
      filePath: "src/index.ts",
      outFile: `dist/index.d.ts`,
      output: {
        umdModuleName: 'PositionObserver',
        noBanner: true,
      }
    },
  ],
};

module.exports = config;
