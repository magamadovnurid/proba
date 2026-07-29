# Предлагаемый контракт backend API

Документ описывает форму будущего API. В текущем прототипе эти методы не реализованы.

## Общие правила

- базовый путь: `/api/v1`;
- авторизация клиента: проверенный Telegram `initData` → короткоживущая серверная сессия;
- кабинеты партнёров: отдельная сессия и MFA;
- денежные значения передаются целым количеством копеек;
- даты передаются в ISO 8601 с часовым поясом;
- повторяемые команды принимают `Idempotency-Key`;
- каждый ответ содержит `request_id` для поддержки.

## Клиент

| Метод | Путь | Назначение |
| --- | --- | --- |
| `POST` | `/auth/telegram` | Обмен Telegram initData на сессию |
| `GET` | `/me` | Профиль и настройки клиента |
| `POST` | `/kits/activate` | Активация QR-кода или кода упаковки |
| `GET` | `/catalog/tests` | Доступные исследования и панели |
| `POST` | `/quotes` | Расчёт цены по лабораториям |
| `POST` | `/orders` | Создание заказа с зафиксированной ценой |
| `POST` | `/orders/{id}/pay` | Создание платежа |
| `POST` | `/courier-jobs` | Выбор слота курьера |
| `GET` | `/cycles/{id}/timeline` | Трекинг цикла и образца |
| `GET` | `/results` | Результаты и динамика |
| `POST` | `/consents` | Выдать врачу ограниченный доступ |
| `DELETE` | `/consents/{id}` | Отозвать действующее согласие |
| `POST` | `/subscriptions` | Создать план следующего цикла |
| `POST` | `/subscriptions/{id}/skip` | Пропустить один цикл |
| `POST` | `/subscriptions/{id}/pause` | Поставить план на паузу |

## Лаборатория

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/lab/orders` | Очередь назначенных заявок |
| `POST` | `/lab/orders/{id}/accept` | Подтвердить состав и SLA |
| `POST` | `/lab/orders/{id}/reject` | Отклонить с кодом причины |
| `POST` | `/lab/samples/{id}/events` | Добавить событие обработки образца |
| `POST` | `/lab/orders/{id}/results` | Загрузить структурированные результаты |
| `POST` | `/lab/orders/{id}/report` | Приложить подписанный исходный документ |
| `POST` | `/lab/orders/{id}/publish` | Опубликовать проверенный результат |

## Врач

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/doctors` | Список проверенных специалистов |
| `GET` | `/doctors/{id}/slots` | Доступные интервалы консультаций |
| `POST` | `/consultations` | Забронировать консультацию |
| `GET` | `/doctor/clients/{id}/results` | Данные в пределах действующего согласия |
| `POST` | `/doctor/consultations/{id}/recommendations` | Сохранить рекомендацию |

## Витрина

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/products` | Общий каталог независимо от рекомендаций |
| `GET` | `/recommendations/{id}/products` | Товары, связанные с рекомендацией |
| `POST` | `/cart/items` | Добавить позицию в корзину |
| `POST` | `/store/orders` | Оформить отдельный товарный заказ |

## Webhook-события

- `payment.succeeded`, `payment.failed`, `payment.refunded`;
- `courier.assigned`, `sample.collected`, `sample.delivered`;
- `lab.order.accepted`, `lab.order.repriced`, `lab.order.rejected`;
- `results.ready`, `results.published`;
- `consultation.confirmed`, `consultation.completed`;
- `subscription.confirmation_required`.

Webhook проверяется криптографической подписью, хранится до успешной обработки и может безопасно повторяться.

## Пример расчёта цены

Запрос:

```json
{
  "test_ids": ["vitd", "ferritin", "tsh"],
  "city": "moscow",
  "subscription_id": null
}
```

Ответ:

```json
{
  "quote_id": "q_01J...",
  "valid_until": "2026-07-29T18:00:00+03:00",
  "currency": "RUB",
  "laboratories": [
    {
      "laboratory_id": "prolab",
      "tests_amount": 379000,
      "service_fee": 19000,
      "discount": 0,
      "total": 398000,
      "eta_hours": 36
    }
  ]
}
```
