# Goa Frame Creator

You are a senior product engineer, creative frontend engineer, interaction designer, and graphics-engineering specialist.

Build a COMPLETE, PRODUCTION-READY web application for the HH Goa 2026 Shortlisting Task.

The final website will be deployed to:

https://teammavericks.tech

Do NOT create a basic landing page.

Do NOT create a generic AI-generated dashboard.

Do NOT make a template that looks unrelated to HH Goa.

Do NOT use placeholder functionality.

Do NOT leave TODOs for core functionality.

Do NOT fake the X sharing functionality.

Do NOT require login/signup.

Do NOT require the user to crop their photo before uploading.

The entire flow must work from beginning to end.

==================================================

1. CORE PRODUCT

==================================================

Build a branded:

HH GOA 2026

FRAME / ID CARD GENERATOR

The user should be able to:

1. Open the website.

2. Upload a selfie/photo.

3. Support JPG/JPEG, PNG and HEIC/HEIF where technically possible.

4. Automatically process the image.

5. Preview the generated HH Goa graphic.

6. Generate a branded profile-picture frame/card.

7. For Builder Card mode, enter:

   - Name

   - Stack / Role

   - Optional short descriptor

8. Generate a fun builder title automatically.

9. See the result instantly.

10. Download the final graphic as a real PNG/JPG file.

11. Share the result to X.

12. Use a pre-filled X caption containing:

      #FrameInGoa

13. The generated result must remain available without requiring authentication.

14. The entire experience must work beautifully on mobile.

The user must be able to finish everything in one session.

No signup wall.

No login wall.

No account creation.

No unnecessary form.

==================================================

2. TWO GENERATION MODES

==================================================

Implement BOTH modes.

MODE A — PFP FRAME

Create a square 1:1 profile picture graphic.

The uploaded photograph stays central.

The HH Goa visual identity becomes the frame surrounding the photo.

The frame should include:

- HH Goa 2026 branding

- tropical Goa-inspired elements

- green/yellow/pink palette

- event typography

- subtle decorative elements

- #FrameInGoa

- tasteful visual hierarchy

The photo must never be unnecessarily distorted.

Automatically handle:

Portrait images

Landscape images

Square images

Off-center faces

Wide photos

Tall photos

Different resolutions

Use intelligent object-fit / cover behavior.

Provide an optional manual reposition/zoom interaction after automatic processing.

MODE B — BUILDER ID CARD

Create a social-media-oriented event card.

This is NOT a printable ID card.

It is an editorial social graphic.

Include:

PHOTO

NAME

STACK / ROLE

GENERATED BUILDER TITLE

HH GOA 2026

#FrameInGoa

GOA / INDIA

28–31 OCT 2026

Use the HH Goa visual language heavily.

The card should feel like something a real creative studio designed specifically for HH Goa.

==================================================

3. IMPORTANT VISUAL DIRECTION

==================================================

The provided reference images are the PRIMARY visual inspiration.

Recreate the design language, not a generic approximation.

Reference visual characteristics:

- deep emerald / tropical green background

- saturated yellow typography

- bright hot-pink accents

- cream/off-white secondary tones

- huge editorial serif headlines

- narrow condensed typography

- hand-drawn tropical illustration style

- Goa beach imagery

- palm trees

- sunset

- sea

- beach huts

- umbrellas

- surfboards

- tropical leaves

- imperfect hand-drawn lines

- retro travel-poster feeling

- modern fashion/editorial composition

- bold oversized type

- intentionally asymmetric layouts

- strong negative space

- playful typography

- layered graphic elements

Do not turn this into:

- generic SaaS UI

- glassmorphism dashboard

- blue/purple AI website

- standard Bootstrap card

- generic event landing page

- boring form page

The design must immediately communicate:

GOA

HH GOA

2026

CREATIVE BUILDERS

BEACH

SUMMER

TECH

CULTURE

ENERGY

==================================================

4. COLOR SYSTEM

==================================================

Create a reusable CSS color system.

Primary:

HH GREEN:

#006B3C

or a visually similar deep tropical green.

DARK GREEN:

#004F32

BRIGHT YELLOW:

#FFD400

HOT PINK:

#FF168C

CREAM:

#FFF8DD

WHITE:

#FFFFFF

BLACK:

#111111

Use gradients very carefully.

Do not make everything gradient-heavy.

The dominant visual should remain:

GREEN + YELLOW

with PINK as a strong accent.

==================================================

5. TYPOGRAPHY

==================================================

Use high-quality web fonts.

Use an editorial serif for huge display headings.

Use a condensed sans / grotesk for utility text.

Use a handwritten/display style selectively for playful elements.

Suggested font combinations:

Display:

Bodoni Moda

DM Serif Display

Cormorant Garamond

or another strong editorial serif.

Condensed:

Oswald

Barlow Condensed

Archivo Narrow

or similar.

Body:

Inter

Manrope

DM Sans

Do NOT randomly mix many fonts.

Maximum 3 major font families.

==================================================

6. HERO EXPERIENCE

==================================================

The first screen should feel like an interactive HH Goa poster.

Create a large hero composition.

Possible headline:

FRAME

YOUR

GOA.

or

BUILD

YOUR

GOA.

or

WELCOME

TO

HH GOA.

Use an oversized masked heading.

The typography should partially interact with the tropical illustration.

Implement:

- masked text

- clipped text

- layered typography

- oversized letters

- subtle parallax

- particle text

- animated decorative elements

- tropical illustrations

- subtle grain

- movement on hover

Do not make animations excessive.

The result must feel premium.

==================================================

7. PARTICLE TEXT

==================================================

Implement a particle-based text effect.

Use React Bits or a comparable implementation.

Use particles to form words such as:

GOA

HH

2026

BUILD

CREATE

The particle effect should be lightweight.

It should not destroy mobile performance.

Use canvas where appropriate.

Respect:

prefers-reduced-motion

If reduced motion is enabled, use a static version.

==================================================

8. MASKED HEADINGS

==================================================

Use masked/clipped typography in the hero.

Example:

A huge "GOA" or "HH GOA" heading where:

- image/illustration appears inside the text

- text overlaps other elements

- yellow text is partially clipped

- pink accent layer crosses the typography

Make it editorial.

==================================================

9. LANYARD CARD — REQUIRED

==================================================

THIS FEATURE IS COMPULSORY.

Create an interactive lanyard-style Builder ID Card.

When the user generates the card:

A physical-looking event badge appears hanging from the top.

The card should have:

- lanyard strap

- connector

- badge holder

- builder card

- uploaded photo

- name

- role

- generated title

- HH Goa branding

Animation:

The lanyard/card should initially swing or swipe into view once.

It should feel like a physical conference badge.

The animation should:

1. enter from above

2. swing slightly

3. rotate naturally

4. settle

5. stop

IMPORTANT:

Do NOT continuously animate it.

It should animate ONCE and then remain stable.

After the animation completes:

transform becomes stable.

The user can still interact with the card.

On desktop:

Allow subtle pointer movement.

On mobile:

Allow subtle touch/parallax interaction.

Do not continuously shake the badge.

==================================================

10. LANYARD IMPLEMENTATION

==================================================

Use React + Framer Motion or Motion.

Create realistic motion:

- spring

- rotation

- slight x/y movement

- damping

- overshoot

- settle

Example conceptual motion:

initial:

y: -400

rotate: -12

opacity: 0

animate:

y: 0

rotate: 0

opacity: 1

with spring-like easing.

Then stop.

The lanyard strap should visually connect to the card.

Do NOT just animate the entire card independently.

The lanyard should visually feel attached to the badge.

==================================================

11. CARD SWIPE / REVEAL

==================================================

Before generation:

Show a subtle instruction:

"DROP YOUR PHOTO"

After upload:

show a preview.

After Generate:

the lanyard card enters.

Allow one intentional swipe/reveal interaction.

For example:

A yellow/pink "BUILD MY CARD" interaction can trigger the card reveal.

After reveal:

the card stays still.

Do not make the user repeat the animation every time.

==================================================

12. PHOTO UPLOAD

==================================================

Build a beautiful upload area.

Text:

DROP YOUR SELFIE

or

CHOOSE YOUR PHOTO

Support:

JPG

JPEG

PNG

HEIC

HEIF

Where browser HEIC support is unavailable:

Implement client-side HEIC conversion using a suitable library such as heic2any.

Do not upload user photos to a server unless absolutely necessary.

Prefer client-side processing for privacy and speed.

The user should see:

- drag/drop

- file picker

- camera capture on supported mobile browsers

For mobile:

Use:

<input type="file" accept="image/jpeg,image/png,image/heic,image/heif" capture="user">

where appropriate.

==================================================

13. PHOTO PROCESSING

==================================================

Do NOT force users to crop before generating.

Automatically handle:

- landscape

- portrait

- square

- very tall

- very wide

- low resolution

- high resolution

- off-center images

Create a crop editor.

The crop editor must support:

- zoom

- pan

- reset

- fit

- fill

Use a high-quality crop library or implement canvas-based positioning.

The photo must remain sharp.

Never stretch faces.

==================================================

14. SELFIE MODE

==================================================

Add a clearly visible:

"TAKE A SELFIE"

button on mobile-capable devices.

If camera access is supported:

Open the device camera.

Allow the user to capture a selfie.

After capture:

show the generated preview.

If camera permission is denied:

fall back gracefully to file upload.

Do not break the UI.

==================================================

15. BUILDER FORM

==================================================

Keep the form extremely short.

Fields:

NAME

STACK / ROLE

OPTIONAL: ABOUT / VIBE

Examples:

Name:

Abdul

Stack:

Frontend Engineer

Vibe:

Building weird things for the web.

Do not require unnecessary fields.

==================================================

16. GENERATED BUILDER TITLE

==================================================

Generate a fun title locally.

Do NOT require an AI API.

Use deterministic/random title generation.

Examples:

GOA CODE SURFER

PIXEL BEACH BUILDER

COCONUT ARCHITECT

SUNSET SYSTEMS ENGINEER

FULL STACK BEACH NOMAD

DEBUGGING BEACH BUM

UI SURF RIDER

CODE & COCONUTS

TROPICAL TECH BUILDER

CHAOS ENGINEER

PRODUCT BEACHCOMBER

DIGITAL SUNSET MAKER

The title should feel playful.

Allow:

"ROLL AGAIN"

to generate another title.

==================================================

17. CARD DESIGN

==================================================

The generated card should look like an actual HH Goa social badge.

Suggested composition:

TOP:

HH GOA

2026

CENTER:

PHOTO

PHOTO should occupy a major area.

BOTTOM:

NAME

ROLE / STACK

GENERATED TITLE

#FrameInGoa

GOA, INDIA

28–31 OCT 2026

Use asymmetric typography.

Example:

AB

DUL

could be visually broken into large typography if appropriate.

Use text wrapping intelligently.

==================================================

18. NAME TEXT WRAPPING

==================================================

IMPORTANT.

Long names must NEVER overflow.

Implement responsive text wrapping.

Examples:

"Abdul Munaf"

"Abdul

Munaf"

or controlled line breaking.

For very long names:

"PRIYANSHU

KUMAR

SHARMA"

Use dynamic font sizing.

Create a utility that calculates the maximum text size that fits the card.

Do NOT simply use overflow:hidden.

The complete name must remain visible.

==================================================

19. TEXT FITTING ENGINE

==================================================

Implement dynamic text fitting for:

Name

Role

Builder title

The text must adapt based on:

- character count

- card dimensions

- viewport

- font size

- available width

Use canvas measurement or ResizeObserver.

Do not rely only on CSS overflow.

==================================================

20. BRAND ILLUSTRATIONS

==================================================

Use the provided HH Goa reference artwork as inspiration.

Create a tropical illustrated environment containing:

- palm trees

- ocean

- sun

- waves

- beach

- beach hut

- surfboard

- umbrellas

- tropical vegetation

Do not use random stock photos.

The illustration should be graphic and vector-like.

Use SVG / CSS shapes where possible.

If assets are needed, keep them local and optimized.

==================================================

21. VISUAL TEXTURE

==================================================

Add subtle:

- paper grain

- film grain

- halftone texture

- tiny imperfections

- print texture

But keep it subtle.

Do not reduce readability.

==================================================

22. MICROINTERACTIONS

==================================================

Use high-quality microinteractions.

Examples:

Upload hover:

slight scale + yellow border

Button:

small press effect

Generate:

tiny burst of particles

Card:

subtle hover tilt

Copy:

success state

Download:

success feedback

Share:

X icon + success state

Do not overanimate.

==================================================

23. REACT BITS

==================================================

Use React Bits components/effects where they improve the experience.

Relevant effects:

- Text animations

- Particle text

- Masked text

- Animated backgrounds

- Split text

- Blur reveal

- Magnetic buttons

- Shiny text

- Animated grid/noise

- Scroll reveal

Use only effects that fit the HH Goa aesthetic.

Do not add effects simply because they exist.

The product must remain fast.

==================================================

24. MAIN APP FLOW

==================================================

FLOW:

LANDING

↓

UPLOAD PHOTO

↓

PHOTO PREVIEW

↓

CROP / POSITION

↓

ENTER NAME + ROLE

↓

GENERATE

↓

LANYARD ANIMATION

↓

FINAL CARD

↓

DOWNLOAD / SHARE

No login.

No signup.

No unnecessary page redirects.

==================================================

25. GENERATION SPEED

==================================================

The result should appear within a few seconds.

Prefer client-side rendering.

Do not use a slow backend for basic image generation.

Use:

Canvas

OffscreenCanvas where available

HTML Canvas

SVG

DOM-to-image if suitable

For final image generation, use a reliable client-side library such as:

html-to-image

or:

dom-to-image-more

or direct Canvas rendering.

The generated output must be an actual image file.

==================================================

26. EXPORT QUALITY

==================================================

Generate a high-resolution social image.

Recommended output:

1080x1080 for PFP

1080x1350 for Builder Card

Also allow an optional:

1920x1080

social format if useful.

The default Builder Card should be optimized for X/social sharing.

Do not export a blurry screenshot.

Use devicePixelRatio / high-resolution canvas rendering.

==================================================

27. DOWNLOAD

==================================================

Download buttons:

DOWNLOAD PNG

DOWNLOAD JPG

PNG should preserve quality.

JPG should use a sensible quality such as 0.92.

Filename:

hh-goa-2026-[name].png

If no name:

hh-goa-2026-builder.png

==================================================

28. SHARE TO X — CRITICAL

==================================================

THIS IS ONE OF THE MOST IMPORTANT REQUIREMENTS.

Implement a REAL X share flow.

Do not create a fake button.

Do not show an alert saying "shared".

Do not redirect to a broken URL.

Use the X intent endpoint.

Construct:

https://twitter.com/intent/tweet

or:

https://x.com/intent/post

with a prefilled text.

Caption example:

Just got my HH Goa 2026 Builder Card 🌴

See you in Goa.

#FrameInGoa

HH Goa 2026

The hashtag:

#FrameInGoa

MUST ALWAYS be present.

The share button must open X in a new tab/window.

==================================================

29. IMPORTANT X IMAGE LIMITATION

==================================================

A browser cannot simply attach an arbitrary generated local Blob directly to the user's X post using the normal web intent API.

Therefore do NOT pretend that the generated image is automatically attached.

Implement the best reliable flow:

1. Generate the image.

2. Download/save the image locally.

3. On supported mobile environments, use Web Share API.

4. If the browser supports:

   navigator.share({

      files: [generatedFile],

      text: caption

   })

   use it.

5. Otherwise open X intent with the prefilled caption.

6. Clearly explain if manual image attachment is required.

The UI should say:

"Share your card to X"

and provide:

"Share image"

and:

"Open X"

Do not falsely claim that the browser attached the image if it cannot.

==================================================

30. MOBILE SHARE

==================================================

On mobile:

Prefer:

navigator.share()

with the generated image File.

Example:

navigator.share({

  files: [file],

  text: "#FrameInGoa ..."

})

If supported.

Fallback:

download image + open X.

The experience should be obvious.

==================================================

31. SHARE CAPTION

==================================================

Use a default caption:

I just built my HH Goa 2026 identity 🌴

Ready for Goa.

#FrameInGoa

Allow the user to edit the caption before sharing.

But NEVER remove the required hashtag automatically.

If the user removes it manually:

restore it before sharing.

==================================================

32. OG IMAGE / LINK SHARING

==================================================

If implementing link sharing:

Do NOT pretend that a dynamically generated client-side image can automatically become an OG image.

For dynamic link preview support, use a real backend/serverless OG generation system.

If implementing:

/api/og

generate a dynamic OG image from query parameters or a stored ID.

However:

Do not make the core product dependent on backend persistence.

The primary generation should remain client-side.

==================================================

33. OPTIONAL SHARE PAGE

==================================================

Create:

/share/:id

only if a reliable share persistence strategy is implemented.

If used:

The page must display:

- generated card

- HH Goa branding

- name

- #FrameInGoa

- Download

- Share to X

The OG metadata must use the actual generated graphic.

Never use a blank default OG image.

==================================================

34. NO LOGIN

==================================================

Absolutely no authentication required for:

- upload

- generation

- download

- preview

- sharing

==================================================

35. PRIVACY

==================================================

Prefer local browser processing.

Do not permanently store user photos.

Do not send photos to third-party AI services.

Do not use facial recognition.

Do not perform face identification.

Do not collect unnecessary personal data.

Provide a small privacy note:

"Your photo is processed locally in your browser whenever possible."

==================================================

36. RESPONSIVE DESIGN

==================================================

The website must be excellent on:

iPhone

Android

iPad

Laptop

Desktop

Large monitors

Breakpoints should be carefully designed.

Mobile is NOT a shrunken desktop.

Create dedicated mobile layouts.

==================================================

37. MOBILE HERO

==================================================

On mobile:

Huge typography should scale intelligently.

Do not overflow horizontally.

The lanyard card should fit inside the viewport.

Buttons should be large enough to tap.

Upload should be easy with one thumb.

Use safe-area insets.

==================================================

38. DESKTOP LAYOUT

==================================================

Desktop:

Left:

creative HH Goa visual/hero

Right:

generator panel

or:

full-screen editorial hero

↓

generator section

The final result should occupy a major portion of the screen.

==================================================

39. NAVIGATION

==================================================

Minimal navigation.

Logo:

HH GOA 2026

Links:

CREATE

HOW IT WORKS

SHARE

No unnecessary menus.

Use sticky navigation only if it improves UX.

==================================================

40. HOW IT WORKS

==================================================

Add a section:

HOW IT WORKS

01

DROP YOUR PHOTO

02

ADD YOUR BUILDER INFO

03

GET YOUR HH GOA CARD

04

SHARE YOUR GOA IDENTITY

Use animated numbered cards.

==================================================

41. FORMAT SELECTOR

==================================================

Add:

CHOOSE YOUR FORMAT

[ PFP FRAME ]

[ BUILDER CARD ]

The selection should have strong visual feedback.

PFP:

square

Builder:

portrait social card

==================================================

42. LIVE PREVIEW

==================================================

The user should see a live preview.

When name changes:

card updates.

When role changes:

card updates.

When photo changes:

card updates.

Do not require a separate submit button for every field.

==================================================

43. RESET

==================================================

Add:

START OVER

It must clear:

photo

name

role

title

crop

generated result

and return to upload.

==================================================

44. ERROR HANDLING

==================================================

Handle:

invalid image

oversized file

unsupported format

HEIC conversion failure

camera denied

download failure

share unsupported

popup blocked

canvas rendering failure

Never leave the user with a blank screen.

Use friendly messages.

Examples:

"That photo format isn't supported by this browser. Try JPG or PNG."

"Your browser doesn't support direct image sharing. We've downloaded your card so you can attach it to X."

==================================================

45. ACCESSIBILITY

==================================================

Implement:

semantic HTML

ARIA labels

keyboard navigation

visible focus

proper contrast

alt text

reduced motion

Buttons must have accessible names.

Do not use color alone to communicate state.

==================================================

46. PERFORMANCE

==================================================

Optimize aggressively.

Use:

lazy loading

code splitting

compressed assets

SVG illustrations

requestAnimationFrame

canvas optimization

Avoid unnecessary dependencies.

Do not render expensive particles continuously.

Stop animations when not visible.

Respect:

prefers-reduced-motion

==================================================

47. COMPONENT ARCHITECTURE

==================================================

Use a clean React architecture.

Suggested structure:

src/

  components/

    Hero/

    Navbar/

    UploadZone/

    PhotoEditor/

    FormatSelector/

    BuilderForm/

    BuilderCard/

    Lanyard/

    CardPreview/

    ParticleText/

    MaskedHeading/

    SharePanel/

    DownloadButtons/

    HowItWorks/

    Footer/

  hooks/

    useImageUpload

    useImageCrop

    useTextFit

    useCardExport

    useShare

  lib/

    imageProcessing

    heic

    export

    share

    builderTitles

  data/

    titles

    themes

  styles/

Keep logic separated.

==================================================

48. STATE MANAGEMENT

==================================================

Do not install Redux unless genuinely necessary.

Use React state/context.

Suggested state:

photo

photoUrl

photoFile

photoDimensions

crop

zoom

format

name

role

description

builderTitle

generatedImage

isGenerating

isSharing

isDownloading

lanyardPlayed

shareSupported

error

==================================================

49. CARD EXPORT

==================================================

IMPORTANT:

The visual DOM card and exported image must match.

Do not export only the photo.

Do not export a screenshot of the whole browser.

Do not include:

buttons

cursor

UI

background website elements

Only export the actual card.

==================================================

50. EXPORT SAFE AREA

==================================================

The generated graphic must have a controlled canvas size.

Example Builder Card:

1080 x 1350

Everything must remain within the export boundary.

No clipping.

No text outside.

==================================================

51. PFP EXPORT

==================================================

PFP:

1080x1080

Use:

photo center

frame around it

HH GOA branding

#FrameInGoa

Ensure the image works as an X profile picture.

==================================================

52. BUILDER CARD EXPORT

==================================================

Builder Card:

1080x1350

Suggested composition:

Top:

HH GOA 2026

Center:

large photo

Bottom:

NAME

ROLE

BUILDER TITLE

Footer:

GOA, INDIA

28–31 OCT 2026

#FrameInGoa

==================================================

53. CARD THEMING

==================================================

Create at least 3 internal HH Goa visual compositions.

Theme 1:

Sunset Goa

Theme 2:

Beach Club

Theme 3:

Tropical Builder

All must remain clearly HH Goa.

Do not make them unrelated.

Allow the user to switch between them if it improves the experience.

==================================================

54. DEFAULT THEME

==================================================

Default theme should use:

deep green background

bright yellow typography

pink accents

cream

tropical illustration

This should be the strongest and most recognizable version.

==================================================

55. VISUAL DETAILS

==================================================

Include details inspired by the provided reference images:

- huge yellow serif typography

- small uppercase labels

- thin yellow lines

- pink accent blocks

- hand-drawn border

- tropical palms

- sun

- ocean

- beach

- Goa hut

- surfboard

- waves

- graphic silhouettes

The reference artwork has a very specific editorial poster character.

Match its visual spirit closely.

==================================================

56. DO NOT COPY OTHER PROJECTS

==================================================

The following teams/projects were reported to have issues.

Use this as a QA checklist.

Do NOT copy their designs.

Do NOT use another team's implementation.

Do NOT reproduce generic AI templates.

The final website must look custom-built.

==================================================

57. FAILURE MODES FROM OTHER TEAMS

==================================================

The final implementation MUST explicitly avoid ALL of these:

Copied project

Share to X not working

No HH Goa theme

No X post

No live link

Broken deployment

404

Missing project link

Missing selfie

Missing #FrameInGoa

X redirect failure

X suspended account dependency

Theme not aligned

AI-generated generic design

No HH Goa frame

No mobile selfie flow

No working post flow

No working live URL

Every one of these must be addressed.

==================================================

58. QA CHECKLIST

==================================================

Before considering the project finished, test:

[ ] Website loads on production domain.

[ ] HTTPS works.

[ ] Desktop loads.

[ ] Mobile loads.

[ ] iPhone Safari loads.

[ ] Android Chrome loads.

[ ] Upload JPG works.

[ ] Upload PNG works.

[ ] HEIC works where supported.

[ ] HEIC fallback works.

[ ] Camera selfie works.

[ ] Landscape image works.

[ ] Portrait image works.

[ ] Square image works.

[ ] Off-center photo works.

[ ] Crop works.

[ ] Zoom works.

[ ] Pan works.

[ ] Name works.

[ ] Long name wraps.

[ ] Very long name fits.

[ ] Role works.

[ ] Builder title generates.

[ ] Roll title works.

[ ] PFP mode works.

[ ] Builder mode works.

[ ] Lanyard animation plays.

[ ] Lanyard animation only plays once.

[ ] Card settles correctly.

[ ] Card does not continuously shake.

[ ] Final card looks correct.

[ ] Export PNG works.

[ ] Export JPG works.

[ ] Export resolution is correct.

[ ] Export doesn't contain website UI.

[ ] Download works.

[ ] X share opens.

[ ] X caption is prefilled.

[ ] #FrameInGoa is included.

[ ] Mobile Web Share works where supported.

[ ] X fallback works.

[ ] No login required.

[ ] No signup required.

[ ] Reset works.

[ ] Error states work.

[ ] Reduced motion works.

[ ] No horizontal overflow.

[ ] No console errors.

[ ] No broken assets.

[ ] No broken routes.

[ ] Production build succeeds.

==================================================

59. X SHARE TEST

==================================================

Actually test the share URL.

Example expected:

https://x.com/intent/post?text=...

or the supported equivalent.

The text must be URL encoded correctly.

Do not concatenate raw spaces or special characters.

The X window should open correctly.

==================================================

60. LIVE DEPLOYMENT

==================================================

The final project must be deployable to Vercel.

Use:

npm run build

and ensure it succeeds.

Avoid filesystem assumptions.

Avoid localhost-only code.

No:

localhost

127.0.0.1

inside production functionality.

==================================================

61. DOMAIN

==================================================

Production domain:

https://teammavericks.tech

Make the project production-ready for this domain.

Use relative URLs where possible.

If absolute URLs are needed:

https://teammavericks.tech

must be the production base URL.

==================================================

62. SEO

==================================================

Add proper metadata.

Title:

HH Goa 2026 — Frame Your Goa

Description:

Create your HH Goa 2026 Builder Card, frame your selfie, and share your Goa identity with #FrameInGoa.

Open Graph:

og:title

og:description

og:type

og:url

og:image

Twitter/X:

twitter:card

twitter:title

twitter:description

twitter:image

==================================================

63. FAVICON

==================================================

Create a simple HH Goa-inspired favicon.

Use:

green background

yellow HH/GOA mark

Do not use the default Vite icon.

==================================================

64. FOOTER

==================================================

Footer should be simple and premium.

Text:

DONE BY

TEAM TECH MAVERICKS

Then:

LinkedIn

three team member profile links.

For now create:

Team Member 01

Team Member 02

Team Member 03

Use proper LinkedIn logo/icon.

Use Lucide or Simple Icons if available.

IMPORTANT:

The three LinkedIn URLs will be supplied later.

Make them configurable from one data file.

For example:

src/data/team.ts

const teamMembers = [

  {

    name: "...",

    linkedin: "..."

  },

  ...

]

When the actual URLs are provided, only this file should need modification.

Do not hard-code LinkedIn URLs throughout the application.

==================================================

65. FOOTER DESIGN

==================================================

Keep footer visually consistent with HH Goa.

Green background.

Yellow typography.

Pink accent.

Small tropical decorative graphics.

Example:

BUILT WITH

CURIOSITY + CODE

TEAM TECH MAVERICKS

[LinkedIn] Member 01

[LinkedIn] Member 02

[LinkedIn] Member 03

==================================================

66. UI BUTTON LANGUAGE

==================================================

Use playful language.

Instead of:

Submit

use:

BUILD MY CARD

Instead of:

Upload File

use:

DROP YOUR SELFIE

Instead of:

Generate

use:

MAKE IT GOA

Instead of:

Download

use:

SAVE MY CARD

Instead of:

Share

use:

TAKE IT TO X

==================================================

67. LOADING STATE

==================================================

Do NOT show a boring full-page spinner.

Use a branded generation state.

Example:

BUILDING YOUR GOA ID...

Then:

PHOTO

TYPE

DESIGN

GOA

with small animated transitions.

The process should feel fast.

Do not make users stare at a fake 10-second animation.

Animation duration should roughly reflect actual processing.

==================================================

68. GENERATION SUCCESS

==================================================

After generation:

Show:

YOUR GOA ID IS READY.

Then:

lanyard card enters.

Below it:

SAVE MY CARD

TAKE IT TO X

START OVER

==================================================

69. SHARE SECTION

==================================================

After generation show a dedicated share panel.

Headline:

SHOW THE WORLD

YOUR GOA.

Buttons:

SAVE MY CARD

SHARE TO X

COPY CAPTION

The X button should use the actual X logo.

Do not use a fake "Twitter bird" if current X branding is available.

==================================================

70. COPY CAPTION

==================================================

Add a copy caption button.

Caption:

I just got my HH Goa 2026 Builder Card 🌴

See you in Goa.

#FrameInGoa

After copying:

COPIED ✓

==================================================

71. SOCIAL PREVIEW

==================================================

Before sharing:

show the user exactly what the exported graphic looks like.

No browser chrome.

No editor controls inside the image.

The preview should be the final artifact.

==================================================

72. OPTIONAL ANIMATED SHARE

==================================================

The UI may show:

IMAGE

GIF

MOTION

as preview options if implemented.

However:

The PRIMARY submission must always support a real static PNG/JPG export.

If creating an animated version:

generate it only if technically reliable.

Do NOT make GIF/video generation mandatory for the core flow.

The static image is the source of truth.

==================================================

73. LANYARD EXPORT RULE

==================================================

IMPORTANT:

The lanyard animation is a WEBSITE INTERACTION.

It does NOT need to appear as a moving animation in the downloaded PNG.

The downloaded result should be a clean static graphic.

The lanyard animation is only for the experience.

If an animated GIF/video export is implemented, make it an optional enhancement.

==================================================

74. OPTIONAL GIF / VIDEO

==================================================

If feasible, add:

DOWNLOAD MOTION

The motion export could contain:

- lanyard swing

- card reveal

- slight tropical motion

But do NOT sacrifice reliability for this.

Static export remains mandatory.

If motion export is not feasible entirely client-side, hide the option rather than displaying a broken button.

==================================================

75. SECURITY

==================================================

Do not expose API keys.

Do not place secrets in frontend code.

Do not use unnecessary third-party APIs.

Do not upload user images externally unless explicitly required.

==================================================

76. CODE QUALITY

==================================================

Use TypeScript.

Avoid:

any

unless absolutely necessary.

Use reusable components.

Use clear naming.

Do not create one giant App.tsx.

Do not leave dead code.

Do not leave unused imports.

==================================================

77. ERROR-FREE BUILD

==================================================

Before finishing:

run:

npm install

npm run build

Fix all TypeScript errors.

Fix all lint errors.

Fix runtime errors.

Check browser console.

Check mobile layout.

Check export.

Check X share.

==================================================

78. VERCEL

==================================================

The project must work on Vercel.

If using client-side routing:

configure Vercel rewrites correctly.

If using API routes:

make them compatible with Vercel.

Do not depend on a local server.

==================================================

79. NO PLACEHOLDER UI

==================================================

Do not write:

"Coming Soon"

for any required feature.

Do not create buttons that do nothing.

Every visible button must work.

Every required flow must be implemented.

==================================================

80. NO GENERIC AI AESTHETIC

==================================================

This is extremely important.

Avoid:

purple neon

blue gradients

generic AI particles

generic glass cards

floating blobs

generic dashboard panels

standard Tailwind landing-page templates

generic shadcn dashboard styling

The site should feel like:

A Goa creative festival

+

a design studio

+

a tech builder community

+

a 2026 social identity generator.

==================================================

81. DESIGN REFERENCE

==================================================

The supplied HH Goa reference artwork must guide:

Color

Typography

Composition

Illustration

Tone

Spacing

Graphic language

Reference image characteristics include:

Deep green background.

Large yellow serif:

HACK THE HOUSE

Pink Devanagari-inspired accent treatment.

Small uppercase yellow metadata.

Tropical palm trees.

Sunset.

Ocean.

Beach.

Beach hut.

Green/yellow/pink illustrated environment.

Use these visual principles throughout the application.

==================================================

82. INTERACTION QUALITY

==================================================

Use motion intentionally.

Recommended:

Framer Motion / Motion

React Bits

CSS transforms

Canvas particles

Do not animate everything.

Animation hierarchy:

Hero:

subtle continuous ambient movement

Upload:

interaction feedback

Generation:

short branded transition

Lanyard:

ONE-TIME physical entrance

Final card:

stable

Buttons:

microinteraction

==================================================

83. LANYARD PHYSICS

==================================================

Make the lanyard feel physical.

Use:

spring

rotation

small pendulum movement

slight damping

Potential sequence:

card starts above viewport

↓

drops down

↓

rotates left

↓

swings right

↓

small counter swing

↓

settles center

↓

STOP

Do not loop.

==================================================

84. MOBILE LANYARD

==================================================

On mobile:

reduce rotation amplitude.

Do not allow the card to move outside viewport.

Keep card centered.

Keep lanyard visible.

Avoid excessive GPU work.

==================================================

85. CARD VISUAL DEPTH

==================================================

Add subtle:

shadow

border

paper texture

printed edges

lanyard hole

plastic holder illusion

Do not make it photorealistic.

It should still feel graphic/editorial.

==================================================

86. CREATIVE COPY

==================================================

Use copy such as:

FRAME YOUR GOA.

BUILD YOUR IDENTITY.

SEE YOU IN GOA.

28–31 OCT 2026

HH GOA 2026

BUILDERS OF THE HOUSE

MAKE SOMETHING WORTH SHARING.

#FrameInGoa

==================================================

87. ABOUT HH GOA

==================================================

Do not invent facts about the event beyond the provided information.

Use only:

HH Goa 2026

Goa, India

28–31 Oct 2026

Avoid fabricated sponsors, speakers, organizers, awards, statistics, etc.

==================================================

88. FINAL UX

==================================================

The ideal experience:

User opens website.

Immediately sees a beautiful HH Goa poster.

They see:

FRAME YOUR GOA.

[CREATE MY CARD]

They click.

Upload appears.

They choose selfie.

Photo appears.

They position it.

They enter:

Name

Role

They click:

MAKE IT GOA

Short branded generation transition.

Lanyard falls from top.

Card swings.

Card settles.

User sees:

SAVE MY CARD

TAKE IT TO X

They click download.

Real PNG downloads.

They click X.

X opens with:

I just got my HH Goa 2026 Builder Card 🌴

See you in Goa.

#FrameInGoa

No signup.

No broken flow.

Done.

==================================================

89. FINAL DELIVERABLE

==================================================

Build the entire application now.

Do not only describe what you would build.

Actually implement it.

Create all necessary:

components

hooks

utilities

styles

assets

routes

configuration

export functionality

share functionality

responsive layouts

animations

Use placeholder LinkedIn URLs only until the real three URLs are supplied.

==================================================

90. FINAL TEST BEFORE COMPLETION

==================================================

Do not say "done" until these are true:

1. npm run build succeeds.

2. The app works without backend authentication.

3. Upload works.

4. Selfie works.

5. Crop works.

6. Builder form works.

7. PFP mode works.

8. Builder Card works.

9. Lanyard animation works.

10. Lanyard animation runs once and settles.

11. Final graphic is exportable.

12. PNG download works.

13. JPG download works.

14. X intent works.

15. #FrameInGoa exists in the caption.

16. Mobile share works where supported.

17. Mobile fallback works.

18. No horizontal scrolling.

19. Long names do not overflow.

20. HH Goa visual identity is obvious.

21. The supplied reference images are reflected in the visual language.

22. No generic AI dashboard aesthetic.

23. No placeholder buttons.

24. No broken routes.

25. No console errors.

26. Vercel build works.

27. Production domain can use:

https://teammavericks.tech

28. Footer says:

DONE BY

TEAM TECH MAVERICKS

29. Three LinkedIn entries are configurable.

30. The application feels like a polished hackathon finalist submission.

==================================================

91. IMPORTANT IMPLEMENTATION PRIORITY

==================================================

Prioritize in this order:

1. WORKING PRODUCT

2. WORKING IMAGE EXPORT

3. WORKING MOBILE EXPERIENCE

4. WORKING X SHARE FLOW

5. HH GOA VISUAL IDENTITY

6. LANYARD INTERACTION

7. POLISH / MICROINTERACTIONS

8. OPTIONAL EXPERIMENTAL EFFECTS

Never sacrifice functionality for visual effects.

==================================================

92. FINAL DESIGN STANDARD

==================================================

The result should look like something that could realistically be submitted by a strong frontend/product design team.

It should NOT look like:

"Claude made this"

or:

"a boilerplate template"

or:

"AI-generated hackathon website"

It should look custom.

The reviewer should immediately understand:

"This team actually designed and engineered an HH Goa-specific identity generator."

The experience should be memorable.

The generated card should be something a person genuinely wants to post.

Build it.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
