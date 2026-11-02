import { expect, test, type Page } from '@playwright/test'
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
async function holdDrag(page: Page, id: string, dx: number, dy: number, fromName = false) {
  const actor = page.locator(`[data-actor="${id}"]`)
  const { x, y } = await actor.evaluate((node, preferName) => {
    const box = node.getBoundingClientRect(),
      name = node.querySelector('.player-name')!.getBoundingClientRect()
    const candidates = [
      ...(preferName ? [{ x: name.x + name.width / 2, y: name.y + name.height / 2 }] : []),
      ...[
        [0.5, 0.5],
        [0.3, 0.8],
        [0.7, 0.8],
        [0.5, 0.25],
      ].map(([x, y]) => ({ x: box.x + box.width * x, y: box.y + box.height * y })),
    ]
    const point = candidates.find(
      ({ x, y }) => document.elementFromPoint(x, y)?.closest('[data-actor]') === node,
    )
    if (!point) throw new Error('No hay una parte visible del personaje para iniciar el gesto')
    return point
  }, fromName)
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: x + dx, y: y + dy }],
  })
  await expect(actor).toHaveClass(/object-dragging/)
  return {
    actor,
    cdp,
    x: await actor.getAttribute('data-x'),
    y: await actor.getAttribute('data-y'),
  }
}
async function retained(held: Awaited<ReturnType<typeof holdDrag>>) {
  await expect(held.actor).not.toHaveClass(/object-dragging/)
  await expect(held.actor).toHaveAttribute('data-x', held.x!)
  await expect(held.actor).toHaveAttribute('data-y', held.y!)
}
test('Emily y Leo conservan el último punto al recibir una cancelación táctil del navegador', async ({
  page,
}) => {
  await page.goto('/emiverse/')
  for (const id of ['emily', 'guest-leo']) {
    const held = await holdDrag(page, id, id === 'emily' ? -45 : 35, 15, true)
    await expect(held.actor).toHaveAttribute('aria-pressed', 'true')
    await held.cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] })
    await retained(held)
    await page.reload()
    await retained(held)
    await held.cdp.detach()
  }
})
test('un cambio de altura durante el arrastre no devuelve el muñeco al punto inicial', async ({
  page,
}) => {
  await page.goto('/emiverse/')
  const held = await holdDrag(page, 'emily', -35, 12)
  await page.setViewportSize({ width: 390, height: 780 })
  await retained(held)
  await held.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.reload()
  await retained(held)
})
test('interrumpir cerca de una salida guarda el punto sin iniciar otro recorrido', async ({
  page,
}) => {
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Jugar con Leo', exact: true }).tap()
  const held = await holdDrag(page, 'guest-leo', -100, 10)
  await held.cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] })
  await retained(held)
  await expect(page.locator('.world-scene[data-room]')).toHaveAttribute('data-room', 'home')
  await expect(page.locator('.game-screen')).toHaveAttribute('data-travelling', 'false')
})
test('ocultar la página en mitad de un arrastre conserva la posición al recargar', async ({
  page,
}) => {
  await page.goto('/emiverse/')
  const held = await holdDrag(page, 'emily', -35, 12)
  await page.evaluate(() => window.dispatchEvent(new Event('pagehide')))
  await retained(held)
  await page.reload()
  await retained(held)
})
