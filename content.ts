import type { PlasmoCSConfig } from "plasmo";
import { atom } from "xoid";

export const config: PlasmoCSConfig = {
  matches: ["*://*.op.gg/summoners/*/*"],
  all_frames: true,
};

const getLastPathnameSegment = (pathname: string) => pathname.substring(pathname.lastIndexOf("/") + 1);

const $windowLocationPathname = atom(window.location.pathname);
const $summonerName = atom((read) => decodeURI(getLastPathnameSegment(read($windowLocationPathname))));
const $selectedSummoner = atom<string | undefined>();
const $summonerFilterSearch = atom("");
const $recentlyPlayedWith = atom([] as string[], (a) => ({
  hydrate: () =>
    a.update(() =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>(".name a.summoner-info"))
        .map((a) => decodeURI(getLastPathnameSegment(a.href)))
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
    ),
}));
const $summonerNameToGameIndices = atom({} as Record<string, number[]>, (a) => ({
  hydrate: () =>
    a.update(() =>
      Array.from(document.querySelectorAll(".Game")).reduce<Record<string, number[]>>((acc, game, i) => {
        game.querySelectorAll<HTMLAnchorElement>(".summoner-tooltip a").forEach((a) => {
          const summonerName = decodeURI(getLastPathnameSegment(a.href));

          if (summonerName === $summonerName.value) {
            return acc;
          }

          if (acc[summonerName] === undefined) {
            acc[summonerName] = [];
          }

          acc[summonerName].push(i);
        });

        return acc;
      }, {}),
    ),
}));

const createSummonerLi = (summoner: string | undefined) => {
  const li = document.createElement("li");
  const button = document.createElement("button");
  const div = document.createElement("div");
  const span = document.createElement("span");

  span.classList.add("champion-name");
  const text = summoner === undefined ? "All Summoners" : summoner.replace("-", " #");
  span.replaceChildren(document.createTextNode(text));

  div.style.height = "24px";

  button.addEventListener("click", () => $selectedSummoner.set(summoner));

  button.append(div, span);
  li.appendChild(button);

  $summonerFilterSearch.watch((value) => {
    li.style.display = value === "" || text.toLowerCase().includes(value.toLowerCase()) ? "block" : "none";
  });

  return li;
};

const getOrCreateSummonerFilter = () => {
  const existingSummonerFilter = document.querySelector<HTMLElement>("#summonerFilter");
  if (existingSummonerFilter) {
    return existingSummonerFilter;
  }

  const championFilter = document.querySelector(".search")?.parentElement;
  if (!championFilter) {
    return;
  }

  const filtersContainer = championFilter.parentElement;

  const championFilterInput = championFilter.querySelector("input");
  const championFilterPopover = championFilter.querySelector<HTMLElement>(".content");

  const summonerFilter = <HTMLElement>championFilter?.cloneNode(true);
  const summonerFilterInput = summonerFilter.querySelector("input");
  const summonerFilterPopover = summonerFilter.querySelector<HTMLElement>(".content");

  if (
    !filtersContainer ||
    !championFilterInput ||
    !championFilterPopover ||
    !summonerFilterInput ||
    !summonerFilterPopover
  ) {
    return;
  }

  filtersContainer.insertBefore(summonerFilter, championFilter);
  filtersContainer.style.gap = "0.5rem";

  document.addEventListener("click", () => {
    summonerFilterPopover.style.display = "none";
  });
  summonerFilter.addEventListener("click", (e) => e.stopPropagation());
  summonerFilterInput.addEventListener("click", () => (summonerFilterPopover.style.display = "block"));

  summonerFilter.setAttribute("id", "summonerFilter");
  summonerFilterInput.setAttribute("placeholder", "Search a summoner");
  summonerFilterInput.addEventListener("input", () => $summonerFilterSearch.set(summonerFilterInput.value));
  summonerFilterPopover.style.zIndex = "10000002";
};

setInterval(() => {
  if (window.location.pathname !== $windowLocationPathname.value) {
    $windowLocationPathname.set(window.location.pathname);
    $recentlyPlayedWith.set([]);
    $summonerNameToGameIndices.set({});
  }
}, 500);

$selectedSummoner.watch((value) => {
  document.querySelectorAll<HTMLElement>(".Game").forEach((game, i) => {
    if (!game.parentElement) {
      return;
    }

    if (value === undefined) {
      game.parentElement.style.display = "block";

      game.querySelectorAll<HTMLAnchorElement>(".summoner-tooltip span").forEach((span) => (span.style.color = ""));
      return;
    }

    if (($summonerNameToGameIndices.value[value] || []).includes(i)) {
      game.parentElement.style.display = "block";

      game.querySelectorAll<HTMLAnchorElement>(".summoner-tooltip a").forEach((a) => {
        const span = a.querySelector("span");
        if (!span) {
          return;
        }

        span.style.color = decodeURI(getLastPathnameSegment(a.href)) === value ? "var(--gray900)" : "";
      });
      return;
    }

    game.parentElement.style.display = "none";
  });
});

const recentlyPlayedWithContainerObserver = new MutationObserver(() => $recentlyPlayedWith.actions.hydrate());
setInterval(() => {
  const recentlyPlayedWithContainer = document.querySelector(".name a.summoner-info")?.closest("tbody");
  if (!recentlyPlayedWithContainer) {
    return;
  }

  if ($recentlyPlayedWith.value.length === 0) {
    $recentlyPlayedWith.actions.hydrate();
  }

  recentlyPlayedWithContainerObserver.observe(recentlyPlayedWithContainer, { childList: true, subtree: true });
}, 1000);
$recentlyPlayedWith.watch((value) => {
  const summonerFilterPopoverLeft = getOrCreateSummonerFilter()
    ?.querySelector<HTMLElement>(".content")
    ?.querySelectorAll(":scope > ul > li")[0];

  summonerFilterPopoverLeft?.querySelector(".header")?.replaceChildren(document.createTextNode("Recently Played With"));
  summonerFilterPopoverLeft
    ?.querySelector("ul")
    ?.replaceChildren(...value.map((summoner) => createSummonerLi(summoner)));
});

const showMoreButtonObserver = new MutationObserver(() => $summonerNameToGameIndices.actions.hydrate());
setInterval(() => {
  const showMoreButton = Array.from(document.querySelectorAll<HTMLButtonElement>("button.more")).find(
    (el) => el.innerText.toLowerCase() === "show more",
  );
  if (!showMoreButton) {
    return;
  }

  if (Object.keys($summonerNameToGameIndices.value).length === 0) {
    $summonerNameToGameIndices.actions.hydrate();
  }

  showMoreButtonObserver.observe(showMoreButton, { childList: true, subtree: true });
}, 1000);
$summonerNameToGameIndices.watch((value) => {
  const summonerFilterPopoverRight = getOrCreateSummonerFilter()
    ?.querySelector<HTMLElement>(".content")
    ?.querySelectorAll(":scope > ul > li")[1];

  summonerFilterPopoverRight?.querySelector(".header")?.replaceChildren(document.createTextNode("Summoner List"));
  summonerFilterPopoverRight?.querySelector("ul")?.replaceChildren(
    createSummonerLi(undefined),
    ...Object.keys(value)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map((summoner) => createSummonerLi(summoner)),
  );

  $selectedSummoner.set(undefined);
  $summonerFilterSearch.set("");
});

export {};
