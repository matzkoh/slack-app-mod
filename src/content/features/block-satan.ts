import { waitSelector } from '../util'
import { run } from '.'

run(async () => {
  await waitSelector('.c-message_list')
    .then(el => el.querySelectorAll<HTMLElement>('.c-virtual_list__item'))
    .then(processNodes)

  new MutationObserver(mutations => {
    processNodes(mutations.flatMap(mutation => Array.from(mutation.addedNodes)))
  }).observe(document, { childList: true, subtree: true })
})

function processNodes(nodes: Node[] | NodeList) {
  if (!inSatanChannel()) {
    Array.from(nodes).filter(isSatanMessage).forEach(hideElement)
  }
}

function hideElement(el: HTMLElement) {
  el.style.display = 'none'
}

function isSatanMessage(el: Node): el is HTMLElement {
  return (
    el instanceof HTMLElement &&
    !!el.querySelector(
      '.c-message_list .c-virtual_list__item:scope .c-message_kit__gutter__left > a[href="/services/BNV3HJB61"]',
    )
  )
}

function inSatanChannel() {
  return /^satan(?=[_-]|$)/i.test(
    document.querySelector('.p-classic_nav__model__title__name__button')?.textContent ?? '',
  )
}
