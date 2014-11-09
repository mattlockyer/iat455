# Assignment 3

For Assignment 3, I was thinking about having items of either a child's desk, or a teenager's desk animate to the music. I experimented around with different lighting, different items, for different effects, and after many trial and error, this is the result.

## Technical Description

There are ten spheres, ten point lights, one spot light, a custom model for the lamp, another custom model for the action figure, a cylinder for the glass covering, another cylinder for the base, a plane for the wooden table top, and a plane for the drawing. An additive blending was applied to the glass cylinder, and its material consists of an environment map. Bump maps were applied to the table top, the paper, and the bouncing balls.

The ten spheres have a downward "force" applied to them, and so, if not at rest on the table, their velocities are always increasing downwards. However, once their vertical position reaches 0, their vertical velocity is multiplied by -c, where 0 < c < 1. This is what gives them their "bounce".

Other than the bounce, when their vertical position reaches 0, their vertical velocity will result in one of the either two possible outcomes:

1. if the input decibel is greater than the magnitude of the velocity by a particular facter, then that will be the new upwards velocity
2. otherwise, the upwards velocity is multiplied by the "bounce" coefficient.

The hue of each ball is a scale from 0 to 1, where they increment by a step factor of 1/10.

It's the same thing for their respective point lights that are hovering above them. Their intensities, however, are connected with their respective frequency decibel values.

The ball and light with the lowest hue value is represents the lowest frequency, the one afterwards represents a higher frequency, the next higher, and the tenth is the highest.

The spot light's hue value rotates at the rate of the overall decibel of the sound. The louder the sound, the faster the hue rotates. The saturation goes up for loud sounds, and goes down for quieter sounds, where as the lightness goes down as the sound is loud, but goes up when the sound is quiet. Same thing for the ambient light.

## Sources

- http://www.cartographersguild.com/attachments/mapping-elements/1075d1191908763-land-sea-fill-textures-noise1.png
- http://www.rendertextures.com/sparrow-walnut-wood-planks-texture/
- http://www.pencil-drawing-idea.com/images/pencil_drawings_of_spiderman_1.jpg
- https://www.filterforge.com/filters/11004-bump.jpg
- https://sketchfab.com/models/d8036cf130174569991123a3b4d2a626
- http://resources.blogscopia.com/2010/04/22/desk-lamp1-download/
- https://soundcloud.com/edm/fareoh-daydream-edmcom-exclusive