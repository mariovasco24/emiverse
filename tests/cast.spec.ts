import { expect, test, type Locator, type Page } from '@playwright/test'
async function drag(page: Page, actor: Locator, dx: number, dy: number) {
  const box = (await actor.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + dx, box.y + box.height / 2 + dy, { steps: 8 })
  await page.mouse.up()
}
test('sin flechas: Emily, Leo y los personajes creados se mueven de forma independiente', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 800 })
  await page.goto('/emiverse/')
  await expect(page.locator('.direction-pad')).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^Mover / })).toHaveCount(0)
  await expect(page.locator('[data-actor]')).toHaveCount(2)
  const emily = page.locator('[data-actor="emily"]')
  const before = await emily.getAttribute('data-x')
  const leo = page.getByRole('button', { name: 'Seleccionar Leo', exact: true })
  await drag(page, leo, 150, 35)
  await expect(leo).toHaveAttribute('aria-pressed', 'true')
  const leoX = Number(await leo.getAttribute('data-x'))
  expect(leoX).toBeGreaterThan(25)
  await expect(emily).toHaveAttribute('data-x', before!)
  await page.getByRole('button', { name: 'Crear personaje', exact: true }).click()
  await page.getByLabel('¿Cómo te llamas?').fill('Luna')
  await page.getByRole('button', { name: '¡A vivir aventuras!' }).click()
  await expect(page.locator('[data-actor]')).toHaveCount(3)
  const luna = page.getByRole('button', { name: 'Seleccionar Luna', exact: true })
  const lunaBefore = Number(await luna.getAttribute('data-x'))
  await drag(page, luna, -120, 45)
  const lunaX = Number(await luna.getAttribute('data-x'))
  expect(lunaX).toBeLessThan(lunaBefore - 5)
  await expect(leo).toHaveAttribute('data-x', leoX.toFixed(2))
  await page.reload()
  await expect(leo).toHaveAttribute('data-x', leoX.toFixed(2))
  await expect(luna).toHaveAttribute('data-x', lunaX.toFixed(2))
  await page.getByRole('button', { name: 'Jugar con Leo', exact: true }).click()
  const scene = page.getByRole('region', { name: 'Escenario de la casita' })
  const box = (await scene.boundingBox())!
  await scene.click({ position: { x: box.width * 0.7, y: box.height * 0.87 } })
  await expect
    .poll(async () => Number(await leo.getAttribute('data-x')), { timeout: 6000 })
    .toBeGreaterThan(50)
  await expect(luna).toHaveAttribute('data-x', lunaX.toFixed(2))
})
test.describe('táctil', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  test('seleccionar y arrastrar con el dedo cada personaje, incluso tras cambiar de escenario', async ({
    page,
  }) => {
    await page.goto('/emiverse/')
    const cdp = await page.context().newCDPSession(page)
    for (const name of ['Emily', 'Leo']) {
      await page.getByRole('button', { name: `Jugar con ${name}`, exact: true }).tap()
      const actor = page.getByRole('button', { name: `Seleccionar ${name}`, exact: true })
      const initial = Number(await actor.getAttribute('data-x'))
      const box = (await actor.boundingBox())!
      const x = box.x + box.width / 2,
        y = box.y + box.height / 2
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + 32, y: y + 10 }],
      })
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await expect
        .poll(async () => Number(await actor.getAttribute('data-x')))
        .toBeGreaterThan(initial + 3)
    }
    const home = await page
      .getByRole('button', { name: 'Seleccionar Leo', exact: true })
      .getAttribute('data-x')
    await page.getByRole('button', { name: 'Jardín', exact: true }).tap()
    await expect(page.locator('[data-actor]')).toHaveCount(2)
    await page.getByRole('button', { name: 'Casita', exact: true }).tap()
    await expect(
      page.getByRole('button', { name: 'Seleccionar Leo', exact: true }),
    ).toHaveAttribute('data-x', home!)
    await page.screenshot({ path: '/tmp/emiverse-touch-cast-mobile.png' })
  })
})
