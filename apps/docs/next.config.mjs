import nextra from "nextra";

const withNextra = nextra({
  defaultShowCopyCode: true,
});

export default withNextra({
  // The addresses reference imports KNOWN_WRAPPERS straight from the shared
  // package, so the docs can never drift from what the app ships.
  transpilePackages: ["@obscura/shared"],
});
