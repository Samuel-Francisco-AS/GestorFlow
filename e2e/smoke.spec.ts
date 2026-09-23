import { expect, test } from '@playwright/test'

test('a fundação abre e a rota desconhecida tem saída', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'Uma base para trabalhar melhor.' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Botão principal' }),
  ).toBeVisible()

  await page.goto('/rota-inexistente')
  await expect(
    page.getByRole('heading', { name: 'Página não encontrada' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Voltar ao início' }).click()
  await expect(page).toHaveURL('/')
  expect(errors).toEqual([])
})

test('a página inicial cabe em uma tela estreita', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 })
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Uma base para trabalhar melhor.' }),
  ).toBeVisible()
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360)
})
