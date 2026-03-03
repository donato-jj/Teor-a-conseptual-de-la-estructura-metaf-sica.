# Contributing to DQRI/FRIF Interactive Lab

Thank you for considering a contribution to this project.

## Ground Rules

- All contributions must remain consistent with the scientific framing: **no mysticism, no new forces, no unverified experimental claims**. Everything must be clearly labeled as **conceptual simulation**.
- Code must be **pure HTML/CSS/JavaScript** — no frameworks, no CDN dependencies, no external libraries.
- All assets must be generative (Canvas/SVG) — no external images.

## How to Contribute

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature-name`.
3. Make your changes, following the coding style in `docs/app.js`.
4. Verify the page works fully offline in a modern browser (Chrome, Firefox, Safari, Edge).
5. Submit a pull request with a clear description of what was changed and why.

## Code Style

- Use `const`/`let`, no `var`.
- Use descriptive variable names (scientific context: prefer `chi`, `kappa`, `sigma` over `x`, `y`, `z`).
- Comment any non-obvious physics or math with a brief inline explanation.
- Keep functions focused and small (< 80 lines preferred).
- Ensure `aria-label` attributes are present on all interactive controls.

## Reporting Issues

Open a GitHub Issue with:
- Browser and OS version.
- Steps to reproduce.
- Expected vs actual behavior.
- If relevant, the URL hash state (`#...`) for reproducibility.

## Scientific Accuracy

If you find a scientific inaccuracy, open an issue labeling it `scientific-review`. Include references to peer-reviewed literature where possible.

## License

By contributing, you agree your contributions are licensed under the MIT License.
