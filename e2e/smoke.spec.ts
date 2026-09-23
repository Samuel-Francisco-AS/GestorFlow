import { expect, test } from '@playwright/test'

test('dashboard, shell desktop e rota desconhecida', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Bom dia/ })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Ordens recentes' }),
  ).toBeVisible()
  await expect(
    page.getByRole('navigation', { name: 'Navegação principal' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Nova ordem' })).toBeDisabled()
  await page
    .getByRole('link', { name: 'GestorFlow, voltar ao início' })
    .first()
    .click()
  await expect(page).toHaveURL('/')
  await page.goto('/rota-inexistente')
  await expect(
    page.getByRole('heading', { name: 'Página não encontrada' }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Voltar ao início', exact: true })
    .click()
  await expect(page).toHaveURL('/')
  expect(errors).toEqual([])
  await page.screenshot({
    path: 'test-results/dashboard-desktop.png',
    fullPage: true,
  })
})

for (const width of [360, 390]) {
  test(`dashboard e navegação mobile em ${width}px`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height: 780 })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Bom dia/ })).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: 'Navegação mobile' }),
    ).toBeVisible()
    await expect(
      page.getByRole('navigation', { name: 'Navegação principal' }),
    ).toBeHidden()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width)
    expect(errors).toEqual([])
    await page.screenshot({
      path: `test-results/dashboard-${width}.png`,
      fullPage: true,
    })
  })
}
