import React from 'react';
import type { ContentBlock } from '@do-mining/core';

export interface BlockRendererProps {
  block: ContentBlock;
  isPreview?: boolean;
}

export type BlockRendererComponent = React.FC<BlockRendererProps>;

const registry = new Map<string, BlockRendererComponent>();

export function registerBlockRenderer(type: string, component: BlockRendererComponent) {
  registry.set(type, component);
}

export function getBlockRenderer(type: string): BlockRendererComponent | undefined {
  return registry.get(type);
}
