import { test, expect } from '@playwright/test'
test('completa un mundo, desbloquea el siguiente y conserva el progreso', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: '¡Vamos a jugar!' }).click()
  await expect(page.getByRole('heading', { name: 'Tu próxima aventura está aquí' })).toBeVisible()
  await expect(page.getByRole('button', { name: /MUNDO 02/ })).toBeDisabled()
  // Inspect the board through its visible faces, just as a player would.
  const known = new Map<string, number>()
  const cards = page.locator('.memory-card')
  const pairs: number[][] = []
  for (let i = 0; i < 12; i += 2) {
    await cards.nth(i).click()
    const a = await cards.nth(i).getAttribute('aria-label')
    await cards.nth(i + 1).click()
    const b = await cards.nth(i + 1).getAttribute('aria-label')
    for (const [symbol, index] of [[a!, i], [b!, i + 1]] as const) {
      if (known.has(symbol)) pairs.push([known.get(symbol)!, index]); else known.set(symbol, index)
    }
    await expect(page.locator('.memory-card.revealed:not(.matched)')).toHaveCount(0)
  }
  for (const [a, b] of pairs) {
    if (await cards.nth(a).evaluate(el => el.classList.contains('matched'))) continue
    await cards.nth(a).click()
    await cards.nth(b).click()
    await expect(cards.nth(a)).toHaveClass(/matched/)
  }
  await expect(page.getByRole('heading', { name: '¡Brillas con luz propia!' })).toBeVisible()
  await expect(page.getByRole('button', { name: /MUNDO 02/ })).toBeEnabled()
  await page.reload()
  await page.getByRole('button', { name: '¡Vamos a jugar!' }).click()
  await expect(page.getByRole('button', { name: /MUNDO 02/ })).toBeEnabled()
  await page.getByRole('button', { name: /Mis logros/ }).click()
  await expect(page.locator('.summary-cards strong').first()).toHaveText('1')
  expect(errors).toEqual([])
})
test('pausa, reinicio, ayuda y diseño móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/emiverse/')
  await page.getByRole('button', { name: '¡Vamos a jugar!' }).click()
  await page.getByRole('button', { name: 'Revelar carta 1', exact: true }).click()
  await page.getByRole('button', { name: 'Pausar partida', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Hasta las estrellas descansan.' })).toBeVisible()
  await page.getByRole('button', { name: 'Continuar', exact: true }).click()
  await page.getByRole('button', { name: 'Reiniciar partida', exact: true }).click()
  await page.getByRole('button', { name: 'Reiniciar', exact: true }).click()
  await expect(page.locator('.memory-card.revealed')).toHaveCount(0)
  await page.screenshot({ path: '/tmp/emiverse-mobile.png', fullPage: true })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.setViewportSize({ width: 1440, height: 1100 })
  await page.screenshot({ path: '/tmp/emiverse-desktop.png', fullPage: true })
  await page.getByRole('button', { name: '¿Cómo se juega?' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
