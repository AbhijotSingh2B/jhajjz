# Storyboard critique 1

Ranked, worst first. Reading time at 4 words/s.

1. **Too much text.** 61 words in 15 s need about 15.3 s just to read. The worst shots: shot 7 has 16 words in 2.0 s (needs 4 s), shot 6 has 10 words in 1.5 s, and shot 8 has 6 words in 1.5 s plus a map. *Fix:* cut "4 passengers, plus the chauffeur" (all three cars) and "Every vehicle comes with a trained chauffeur" (the hook already says chauffeur-driven). That leaves about 39 words, roughly 10 s of reading.

2. **The CTA is too short.** It is readable for 1.7 s, then the Reel loops. A phone number plus four other items needs about 2.5–3 s. *Fix:* use the 2 s freed by fix 4 to start the end card at 11.0 s. Make the number the largest line, with "Talk to us on WhatsApp" directly above it.

3. **Shots 4→5 are physically wrong.** If the cars are parked in a row facing the same way, passing behind the S-Class's rear shows the Range Rover's rear, not its front. *Fix:* park the Range Rover rotated 180°, or make shot 5 its rear.

4. **The same layout runs three times, with filler.** Each car gets a macro, then a 3/4 wide shot at 40–45° with a stack of labels. Shot 4 (repeated line) and shot 5 (no text, no job) are filler. *Fix:* give each car one shot: Ghost macro-to-wide, S-Class flank track, Range Rover rear 3/4 revealed by the wipe. Put every car name in the same title position.

5. **The Ghost model may be the wrong generation.** The client's Ghost is the first generation (2009–2020); most free Ghosts are the 2020+ car. *Fix:* source a first-generation model, or avoid a grille macro that gives the generation away.

6. **The fleet overview breaks the 60–85% fill rule.** Three cars side by side at 50° come out small, with dead bands and a "slab" angle. *Fix:* park them in a staggered echelon that recedes up the frame, with the camera at about 25–30°.

7. **Free models in software WebGL fail in macro, and the hook is a macro.** Baked grilles and aliased chrome will look toy-like at frame 0. *Fix:* test-render shots 1, 3 and 5 first, at 2x with an HDRI environment. If a macro fails, widen it.

8. **The order isn't how hire is booked.** People start from occasion, city and date, then pick the car. Here the occasions land at 9.5 s and "pan-India" at 11.5 s. *Fix:* hook (add "Jhajj'z") → cars → fleet with the services line (2.5 s) → map (2 s) → CTA.

9. **Lines not exactly in the facts file.** "4 passengers, plus the chauffeur" (the file says "4, plus the chauffeur") and the shortened chauffeur line (the file adds "anywhere in India"). *Fix:* use the facts wording verbatim or drop them (fix 1). Ask Nirmal to confirm "Autobiography", which is still unconfirmed.

10. **The map → end-card handoff doesn't work.** A gold dot can't grow into an ink field. *Fix:* the ink field irises out from the Chandigarh dot, and the gold monogram lands on the dot's exact pixel position.

11. **Safe area.** The pin pinned to the bonnet in shot 2 drifts with the orbit. Shot 1's grille detail sits under the Reels caption. *Fix:* clamp projected labels to x 72–1008, y 250–1500, and keep the macro's detail between y 700 and 1400.

12. **Templated tropes.** Dots lighting outward from head office is a stock "network" move. *Fix:* fade all 14 dots in together.
