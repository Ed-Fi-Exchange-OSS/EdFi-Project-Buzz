module.exports = {
  extends: ["airbnb-typescript-prettier"],
  overrides: [
    {
      files: [
        "**/*.test.js",
        "**/*.test.jsx",
        "**/*.test.ts",
        "**/*.test.tsx"
      ],
      env: {
        jest: true
      },
      rules: {
        "linebreak-style" : ["error", "unix"]
      }
    }
  ]
};
