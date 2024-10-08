# OP.GG Extension

A Chrome extension that holds a special place in my heart—it was the first project I ever completed and published after an entire year of teaching myself JavaScript.

## History

**??/??/2016**: Worked on and off for a couple of months to create what I now consider the worst piece of code I'll ever see in my life.

![image](https://github.com/user-attachments/assets/447a8631-8d65-4f23-b3f8-4f3b97405605)

**11/13/2016**: Announced it to r/leagueoflegends. Quickly got ~4k users.

**11/25/2016**: Immediately lost around half the users after publishing a broken version with relaxed permissions. This mainly happened because, in an attempt to revert the change (by fixing forward), Chrome notified users about "new intrusive permissions". They were actually the original permissions...

**06/25/2020**: I finally decided to get rid of the lag and refactored the extension due to its growth to ~6k users.

![image](https://github.com/user-attachments/assets/66e4ff7a-937f-477a-8ba0-e4069a9adf2e)

**03/14/2022**: Added the main feature from this extension directly to U.GG.

![image](https://github.com/user-attachments/assets/ff2ab3f6-a26a-42ad-9814-7e15f02d8b17)

**??/??/????**: OP.GG updated their site adding a lot more reactivity, browser routing, and atomic CSS. All of these additions completely broke the extension and rendered the code effectively unsalvageable. Since I already added the feature directly to U.GG and was still contracting with them at the time I decided to put off fixing the extension.

**10/08/2024**: Rewrote the extension so it works on the new OP.GG site and upgraded it to Manifest V3 so it would stay on the Chrome Web Store.

# Contributing

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
