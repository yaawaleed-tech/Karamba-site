# Image prompts

Shared style bible for every slot: premium editorial 3D still life, soft
diffused studio light, matte materials; cream `#EFEADF`, indigo `#1B2A4E`,
mist blue `#B9CCE0`, teal `#5FA3A8` and one tiny terracotta `#C26A45`
accent; minimal composition, generous negative space, shallow depth of field,
subtle grain. No text, logos, people, faces, readable interfaces or real
brand marks.

The exact per-slot prompts are generated in [`src/data/imagery.ts`](../src/data/imagery.ts).
The owner can drop the resulting files into
`src/assets/photos/<slug>/<slot>.(jpg|jpeg|png|webp|avif)`. Missing files
render as labelled development placeholders and remain complete in production.
