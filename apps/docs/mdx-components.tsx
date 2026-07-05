import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";

const docsComponents = getDocsMDXComponents();

type DocsComponents = typeof docsComponents;

// Extension point: spread custom components over the docs-theme defaults.
export const useMDXComponents = (
  components?: Partial<DocsComponents>,
): DocsComponents => ({
  ...docsComponents,
  ...components,
});
