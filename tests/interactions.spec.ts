import { expect, test, type Locator, type Page } from '@playwright/test'

async function touchDrag(page: Page, item: Locator, dx: number, dy: number) {
  const box = (await item.boundingBox())!,
    x = box.x + box.width / 2,
    y = box.y + box.height / 2
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: x + dx, y: y + dy }],
  })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await cdp.detach()
}
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

test('tocar paredes no mueve la muñeca y arrastrarla hacia arriba mantiene sus pies en el suelo', async ({
  page,
}) => {
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Cerrar pista' }).tap()
  const actor = page.locator('.actor-active')
  const beforeX = await actor.getAttribute('data-x'),
    beforeY = await actor.getAttribute('data-y')
  await page.touchscreen.tap(195, 285)
  await expect(actor).toHaveAttribute('data-x', beforeX!)
  await expect(actor).toHaveAttribute('data-y', beforeY!)
  await expect(actor.locator('.original-character')).not.toHaveClass(/walking/)
  await touchDrag(page, actor, 25, -400)
  expect(Number(await actor.getAttribute('data-y'))).toBeGreaterThanOrEqual(51)
  await page.reload()
  expect(Number(await actor.getAttribute('data-y'))).toBeGreaterThanOrEqual(51)
  await page.getByRole('button', { name: 'Ir a Cocina', exact: true }).tap()
  await expect(page.locator('.world-scene[data-room]')).toHaveAttribute('data-room', 'kitchen', {
    timeout: 8000,
  })
  await expect(page.locator('.game-screen')).toHaveAttribute('data-travelling', 'false')
  const kitchenY = await actor.getAttribute('data-y')
  await page.touchscreen.tap(195, 285)
  await expect(actor).toHaveAttribute('data-y', kitchenY!)
  await expect(actor.locator('.original-character')).not.toHaveClass(/walking/)
})

test('solo Mover permite arrastrar objetos; jugar activa una sola vez sin diálogos', async ({
  page,
}) => {
  await page.goto('/emiverse/')
  const pet = page.getByRole('button', { name: 'Seleccionar Nubi', exact: true })
  const initial = await pet.getAttribute('data-x')
  await touchDrag(page, pet, 35, -25)
  await expect(pet).toHaveAttribute('data-x', initial!)
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('emiverse-world-v1')!).fed),
  ).toBe(false)
  await pet.tap()
  await expect(page.locator('.memory-count')).toContainText('1')
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('emiverse-world-v1')!).fed),
  ).toBe(true)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('.world-toast')).toHaveCount(0)
  const move = page.getByRole('button', { name: 'Mover objetos', exact: true })
  await move.tap()
  await expect(move).toHaveAttribute('aria-pressed', 'true')
  await touchDrag(page, pet, 35, -20)
  const placed = await pet.getAttribute('data-x')
  expect(Number(placed)).toBeGreaterThan(Number(initial) + 3)
  await move.tap()
  await expect(move).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByRole('button', { name: 'Usar objeto', exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Volver a su lugar', exact: true })).toHaveCount(0)
  const music = page.getByRole('button', { name: 'Seleccionar Música', exact: true })
  await music.tap()
  await expect(page.locator('.record-player')).toHaveClass(/playing/)
  await music.tap()
  await expect(page.locator('.record-player')).not.toHaveClass(/playing/)
  await page.reload()
  await expect(pet).toHaveAttribute('data-x', placed!)
  await expect(move).toHaveAttribute('aria-pressed', 'false')
  await page.screenshot({ path: '/tmp/emiverse-direct-actions-mobile.png' })
})

test('el armario abre al tocar y la nevera se abre y cierra sin confirmación', async ({ page }) => {
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Seleccionar Armario', exact: true }).tap()
  await expect(page.getByRole('dialog', { name: 'Mi armario' })).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar', exact: true }).tap()
  await page.getByRole('button', { name: 'Ir a Cocina', exact: true }).tap()
  await expect(page.locator('.world-scene[data-room]')).toHaveAttribute('data-room', 'kitchen', {
    timeout: 8000,
  })
  await expect(page.locator('.game-screen')).toHaveAttribute('data-travelling', 'false')
  const fridge = page.getByRole('button', { name: 'Seleccionar Nevera', exact: true })
  await fridge.tap()
  await expect(fridge.locator('[data-open]')).toHaveCount(1)
  await fridge.tap()
  await expect(fridge.locator('[data-open]')).toHaveCount(0)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
