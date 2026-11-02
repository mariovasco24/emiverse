import { expect, test, type Page } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
async function startWalking(page: Page) {
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Cerrar pista', exact: true }).tap()
  const scene = (await page.locator('.world-scene[data-room]').boundingBox())!
  await page.touchscreen.tap(scene.width * 0.82, scene.height * 0.94)
  await expect
    .poll(async () => Number(await page.locator('[data-actor="emily"]').getAttribute('data-x')))
    .toBeGreaterThan(55)
}
async function visiblePoint(page: Page) {
  const actor = page.locator('[data-actor="emily"]')
  return { x: await actor.getAttribute('data-x'), y: await actor.getAttribute('data-y') }
}
async function expectPoint(page: Page, point: Awaited<ReturnType<typeof visiblePoint>>) {
  const actor = page.locator('[data-actor="emily"]')
  await expect(actor).toHaveAttribute('data-x', point.x!)
  await expect(actor).toHaveAttribute('data-y', point.y!)
}

test('interrumpir una caminata con la ayuda conserva la posición tras recargar', async ({
  page,
}) => {
  await startWalking(page)
  await page.getByRole('button', { name: 'Cómo jugar', exact: true }).tap()
  await expect(page.getByRole('dialog')).toBeVisible()
  const stopped = await visiblePoint(page)
  await page.getByRole('button', { name: 'Cerrar', exact: true }).tap()
  await expectPoint(page, stopped)
  await page.reload()
  await expectPoint(page, stopped)
})

test('recargar mientras camina conserva el último avance sin esperar a que llegue', async ({
  page,
}) => {
  await startWalking(page)
  const moving = await visiblePoint(page)
  await page.reload()
  expect(Number((await visiblePoint(page)).x)).toBeGreaterThanOrEqual(Number(moving.x) - 0.1)
})

test('activar un objeto detiene y guarda la caminata sin cambiar al personaje de sitio', async ({
  page,
}) => {
  await startWalking(page)
  await page.getByRole('button', { name: 'Seleccionar Música', exact: true }).tap()
  await expect(page.locator('.record-player')).toHaveClass(/playing/)
  const stopped = await visiblePoint(page)
  await page.reload()
  await expectPoint(page, stopped)
})

test('al arrastrar otro muñeco se conserva la posición de ambos al seleccionarlos y recargar', async ({
  page,
}) => {
  await startWalking(page)
  const leo = page.locator('[data-actor="guest-leo"]')
  const box = (await leo.boundingBox())!,
    x = box.x + box.width / 2,
    y = box.y + box.height / 2
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: x + 45, y: y - 15 }],
  })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  const emilyStopped = await visiblePoint(page),
    leoX = await leo.getAttribute('data-x'),
    leoY = await leo.getAttribute('data-y')
  await page.getByRole('button', { name: 'Jugar con Emily', exact: true }).tap()
  await expectPoint(page, emilyStopped)
  await expect(leo).toHaveAttribute('data-x', leoX!)
  await expect(leo).toHaveAttribute('data-y', leoY!)
  await page.reload()
  await expectPoint(page, emilyStopped)
  await expect(leo).toHaveAttribute('data-x', leoX!)
  await expect(leo).toHaveAttribute('data-y', leoY!)
})
