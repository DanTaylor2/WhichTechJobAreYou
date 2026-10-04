# Which tech job are you?

A Wirral Council careers-fair quiz for pupils in years 7 to 11. Six short questions take around two minutes and suggest one public-sector tech career and two alternatives.

## Run it at the event

There are no production dependencies or external assets. Copy the entire `site` folder onto each laptop, then open `site/index.html` in a browser. This works without internet access or a local server. Keep the files together.

For the hosted version, open the GitHub Pages URL on each laptop while online. Before the event, disconnect and reload to verify the offline copy is ready. The service worker caches the site files, so the page can reload offline in that browser. Browser storage clearing or private browsing can remove the cache; keep the downloaded folder as the event backup.

Use browser full-screen mode for the stand. Pupils can use touch, mouse or keyboard. Select **Next person** after each result to clear the answers and return to the start. **Start again** clears an unfinished quiz. Reloading also clears answers. There is no automatic timeout while a pupil is reading.

Before the event, try the quiz on the actual laptop and monitor arrangement, and check that the window appears on the touchscreen when touch input is needed. The two-minute estimate should be checked with a few pupils.

## Deploy to GitHub Pages

1. Put this project in a GitHub repository with a `master` branch.
2. In the repository, open **Settings → Pages → Build and deployment** and select **GitHub Actions** as the source.
3. Push to `master`, or run **Test and deploy GitHub Pages** from the Actions tab.

The workflow tests the matching logic and browser experience, then publishes only the `site` folder. Pull requests run the tests without deploying. All asset paths are relative, so a repository URL such as `https://YOUR-ACCOUNT.github.io/WhichTechJobAreYou/` works without configuration. If your default branch has a different name, update both branch references in `.github/workflows/deploy.yml`.

This folder does not come with a GitHub remote or a live deployment already configured.

## Development and checks

Use Node.js 22 or newer.

```sh
npm ci
npm start
```

Open `http://127.0.0.1:4173`. To run checks:

```sh
npm test
npx playwright install chromium
npm run test:browser
```

The unit tests check all 4,096 answer combinations, role coverage and invalid inputs. Browser tests cover validation, editing answers, resetting between pupils, keyboard navigation, touch layouts, accessibility checks with axe, offline reloads and opening the downloaded site directly from disk. Automated accessibility checks do not replace testing with assistive technology.

## Content and matching

Edit the eight role profiles and six questions in `site/quiz-data.js`. Each choice awards three points to a primary role and one point to a related role. Every role appears three times in each position across the quiz. The result is the role with the most points, followed by two alternatives. Ties use primary-choice counts and then a deterministic ordering derived from the answers. This is an exploratory activity, not a validated careers assessment; it makes no aptitude or suitability claim.

Answers live only in page memory. The app has no analytics, forms that submit data, cookies, accounts or answer storage. The offline cache stores public site files only. GitHub Pages provides the hosting and may maintain its own request logs.

The layout follows GDS conventions for typography, buttons, radio groups, focus states and plain language. It uses an Arial system font and a text-only Wirral Council identity, with no external fonts or copied government crest. The palette uses the green from [Wirral Council's website](https://www.wirral.gov.uk/), with darker shades for text contrast. The Council favicon is saved locally in `site/favicon.ico`.

When changing any site files, increment the cache version in `site/sw.js`. An updated service worker activates after tabs using the old version close. Before an event, reconnect, close old quiz tabs, reopen the site and check the updated content.

Reference guidance: [GOV.UK Design System](https://design-system.service.gov.uk/), [typeface guidance for sites outside GOV.UK](https://design-system.service.gov.uk/styles/typeface/), and [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
