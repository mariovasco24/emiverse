import { expect, test } from '@playwright/test'
for (const [name, width, height] of [
  ['phone', 390, 844],
  ['phone-landscape', 844, 390],
  ['tablet', 820, 1180],
  ['desktop', 1440, 900],
] as const) {
  test(`escenario inmersivo y controles accesibles en ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.goto('/emiverse/')
    await page.getByRole('button', { name: 'Cerrar pista' }).click()
    const scene = await page.getByRole('region', { name: 'Escenario de la casita' }).boundingBox()
    expect(scene).toEqual({ x: 0, y: 0, width, height })
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollHeight <= innerHeight &&
          document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    for (const label of ['Crear personaje', 'Mi vestidor', 'Jugar con Leo', 'Cómo jugar']) {
      const button = page.getByRole('button', { name: label, exact: true })
      await expect(button).toBeInViewport()
      const box = await button.boundingBox()
      expect(box!.width).toBeGreaterThanOrEqual(34)
      expect(box!.height).toBeGreaterThanOrEqual(31)
    }
    await page.screenshot({ path: `/tmp/emiverse-game-${name}.png` })
    await page.getByRole('button', { name: 'Abrir mapa de aventuras' }).click()
    await page.getByRole('button', { name: /Arcoflor/ }).click()
    await expect(page.getByRole('region', { name: 'Escenario del jardín' })).toBeVisible()
    await expect(page.locator('.memory-count')).toContainText('1')
    await page.screenshot({ path: `/tmp/emiverse-garden-${name}.png` })
  })
}
test('el personaje permanece entero al caminar hasta ambos bordes del celular', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: 'Cerrar pista' }).click()
  await page.keyboard.down('ArrowLeft')
  await expect
    .poll(async () => Number(await page.locator('.actor-active').getAttribute('data-x')), {
      timeout: 8000,
    })
    .toBeLessThan(30)
  await page.keyboard.up('ArrowLeft')
  expect((await page.locator('.actor-active').boundingBox())!.x).toBeGreaterThanOrEqual(0)
  await page.keyboard.down('ArrowRight')
  await expect
    .poll(async () => Number(await page.locator('.actor-active').getAttribute('data-x')), {
      timeout: 8000,
    })
    .toBeGreaterThan(70)
  await page.keyboard.up('ArrowRight')
  const box = await page.locator('.actor-active').boundingBox()
  expect(box!.x + box!.width).toBeLessThanOrEqual(390)
})
