import { registerBlockRenderer } from './registry.js';
import { RichTextBlock } from './RichTextBlock.js';
import { CalloutBlock } from './CalloutBlock.js';
import { VideoBlock } from './VideoBlock.js';
import { ImageBlock } from './ImageBlock.js';
import { QuizEmbedBlock } from './QuizEmbedBlock.js';

export function setupDefaultBlocks() {
  registerBlockRenderer('rich_text', RichTextBlock);
  registerBlockRenderer('callout', CalloutBlock);
  registerBlockRenderer('video', VideoBlock);
  registerBlockRenderer('image', ImageBlock);
  registerBlockRenderer('quiz_embed', QuizEmbedBlock);
}

setupDefaultBlocks();
