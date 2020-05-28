module.exports = {
  extends: ["airbnb-typescript-prettier"],
  overrides: [
    {
      files: [
        "**/*.test.js",
        "**/*.test.jsx",
        "**/*.test.tx",
        "**/*.test.tsx"
      ],
      env: {
        jest: true
      }
    }
  ]
};