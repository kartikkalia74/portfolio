import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypePrettyCode from 'rehype-pretty-code';


// https://astro.build/config
export default defineConfig({
  site: 'https://www.kartikkalia.in',
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'one-dark-pro', // or any theme you like
          onVisitLine(node) {
            // Ensure empty lines are rendered
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push('highlighted');
          },
          // Add a custom handler to inject the copy button
          onVisitHighlightedWord(node) {
            node.properties.className = ['word'];
          },
        },
      ],
    ],
  },
  collections: {
    blog: {
      schema: {
        title: 'string',
        description: 'string',
        pubDate: 'date',
        updatedDate: 'date?',
        heroImage: 'string?',
        tags: 'string[]'
      }
    }
  }
});