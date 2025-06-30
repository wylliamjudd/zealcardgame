import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  children?: React.ReactNode;
}

const defaultTitle = 'Zeal | Trading Card Game';
const defaultDescription = 'Zeal is an epic trading card game.';
const defaultImage = 'https://media.zealtcg.com/assets/iconZeal.png';
const defaultUrl = 'https://ZealTCG.com/';
const defaultType = 'website';
const defaultKeywords = 'zeal, tcg, trading card game';

const SEO: React.FC<SEOProps> = ({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  url = defaultUrl,
  type = defaultType,
  keywords = defaultKeywords,
  children
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#111827" />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content={type} />
    {children}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />

    {/* App icons and favicon */}
    <link rel="icon" type="image/png" href="https://media.zealtcg.com/assets/iconZeal.png" />
    <link rel="apple-touch-icon" href="https://media.zealtcg.com/assets/iconZeal.png" />
    <link rel="manifest" href="https://media.zealtcg.com/assets/site.webmanifest" />
  </Helmet>
);

export default SEO;
