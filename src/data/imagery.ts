export type ImageSlot = 'banner' | 'inset' | 'detail';

export interface ImageSpec {
  slug: string;
  slot: ImageSlot;
  aspectRatio: string;
  width: number;
  height: number;
  alt: string;
  focalPoint: string;
  use: string;
  prompt: string;
}

const style =
  'Premium editorial 3D still life, soft diffused studio light, matte materials, palette cream #EFEADF, indigo #1B2A4E, mist blue #B9CCE0, teal #5FA3A8 with one tiny terracotta #C26A45 accent, minimal composition, generous negative space, shallow depth of field, subtle grain, no text, no logos, no people or faces, no screens showing readable interface, no real brand marks.';

export const IMAGERY: ImageSpec[] = ['websites-and-branding', 'custom-software', 'management-systems', 'automation-and-ai', 'cloud-and-support', 'hub'].flatMap((slug) =>
  (['banner', 'inset', 'detail'] as ImageSlot[]).map((slot) => ({
    slug,
    slot,
    aspectRatio: slot === 'banner' ? '21:9' : slot === 'inset' ? '4:5' : '1:1',
    width: slot === 'banner' ? 1600 : 800,
    height: slot === 'banner' ? 686 : 800,
    alt: slot === 'detail' ? '' : `Editorial illustration for ${slug.replaceAll('-', ' ')}`,
    focalPoint: '50% 50%',
    use: slot === 'banner' ? 'Full-bleed editorial band' : slot === 'inset' ? 'Masked inset beside section copy' : 'Detail card or bento panel',
    prompt: `${style} Subject: an abstract ${slug.replaceAll('-', ' ')} composition for a ${slot} image slot.`,
  })),
);

export function imageryFor(slug: string, slot: ImageSlot) {
  return IMAGERY.find((item) => item.slug === slug && item.slot === slot)!;
}
