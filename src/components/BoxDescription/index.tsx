import React from 'react'

import { Article } from '@/styles/pages/BoxDescription';

interface BoxDescription {
  title?: string;
  subtitle?: string;
  paragraph?: string;
  paragraph_two?: string;
}

const BoxDescription: React.FC<BoxDescription>= ({ title, subtitle, paragraph, paragraph_two }) => (
  <Article>
    <h1>{title}</h1>
    <span>{subtitle}</span>
    <p>{paragraph}</p>
    <p>{paragraph_two}</p>
  </Article>
);

export default BoxDescription;
