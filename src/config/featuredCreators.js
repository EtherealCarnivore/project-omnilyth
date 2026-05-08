/**
 * Featured creators per game. Read by YouTubeCard.
 *
 * Shape per entry:
 *   { name, handle, url, avatar, banner }
 *
 * Set to `null` when the game's creator is not yet decided — YouTubeCard
 * renders nothing in that case (no placeholder copy).
 *
 * Avatar / banner URLs come from yt3.googleusercontent.com and are
 * tokenised — they may rotate. The component has onError fallbacks for
 * both, so a stale URL degrades to a coloured initial avatar + plain
 * gradient banner rather than a broken image.
 */

const IVA = {
  name: 'Iva',
  handle: '@Iva_m1',
  url: 'https://www.youtube.com/@Iva_m1',
  avatar: 'https://yt3.googleusercontent.com/_lzsI2gEgcOiuwp8V5zirNrkFrOB16KTMQwjUTvX4BihEL39hnfkQ_26ACQx6uKcnlUBRF2Trg=s160-c-k-c0x00ffffff-no-rj',
  banner: 'https://yt3.googleusercontent.com/ryFauGNsarG1c-pX7vgK1WIAGjmOcHOyUqE09DcJlAZ0w1w7B3QkFufgOptQSxKRTvyO9lXHZg=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj',
};

export const FEATURED_CREATORS = {
  poe1: IVA,
  poe2: IVA, // same creator covers both games today
};
