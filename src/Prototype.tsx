import { useMemo, useState, type ReactNode } from "react";
import {
  ActivityLogIcon,
  ArrowLeftIcon,
  BackpackIcon,
  BarChartIcon,
  BellIcon,
  CalendarIcon,
  CameraIcon,
  CheckCircledIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  CubeIcon,
  DashboardIcon,
  FileTextIcon,
  HeartIcon,
  HomeIcon,
  IdCardIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  PaperPlaneIcon,
  PersonIcon,
  PlusIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import {
  BottomSheet,
  Carousel,
  FlowStack,
  KeyboardInput,
  MobileScroll,
  type FlowControls,
  type FlowScreen,
} from "./mobile";

type TestItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit?: string;
};

type ProductItem = {
  id: string;
  name: string;
  meta: string;
  price: number;
  recommended?: boolean;
};

const tests: TestItem[] = [
  { id: "vitd", name: "Витамин D (25-OH)", category: "Витамины", price: 1490 },
  { id: "b12", name: "Витамин B12", category: "Витамины", price: 990 },
  { id: "ferritin", name: "Ферритин", category: "Метаболизм", price: 890 },
  { id: "tsh", name: "ТТГ (TSH)", category: "Щитовидная", price: 790 },
  { id: "apob", name: "ApoB", category: "Сердце", price: 1580 },
  { id: "glucose", name: "Глюкоза", category: "Метаболизм", price: 420 },
  { id: "insulin", name: "Инсулин", category: "Метаболизм", price: 650 },
];

const products: ProductItem[] = [
  {
    id: "vitd3",
    name: "Vitamin D3 2000",
    meta: "60 капсул · партнёрская аптека",
    price: 890,
    recommended: true,
  },
  {
    id: "omega",
    name: "Omega-3 + K2",
    meta: "90 капсул · партнёрская аптека",
    price: 1290,
    recommended: true,
  },
  {
    id: "magnesium",
    name: "Магний бисглицинат",
    meta: "60 капсул · независимая покупка",
    price: 1190,
  },
];

const rub = new Intl.NumberFormat("ru-RU");

function money(value: number) {
  return `${rub.format(value)} ₽`;
}

function ScreenHeader({ flow, title, trailing }: { flow: FlowControls; title: string; trailing?: ReactNode }) {
  return (
    <div className="app-toolbar">
      <button className="icon-button" type="button" aria-label="Назад" onClick={() => flow.pop()}>
        <ArrowLeftIcon />
      </button>
      <strong>{title}</strong>
      <div className="toolbar-trailing">{trailing}</div>
    </div>
  );
}

function screen(id: string, title: string, render: (flow: FlowControls) => ReactNode, footer?: (flow: FlowControls) => ReactNode): FlowScreen {
  return {
    id,
    title,
    header: (flow) => <ScreenHeader flow={flow} title={title} />,
    headerHeight: 56,
    footer,
    footerHeight: footer ? 84 : 0,
    render,
  };
}

function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="section-title-row">
      <div>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Pill({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "mint" | "orange" | "gray" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function PrimaryButton({ children, onClick, disabled, testId }: { children: ReactNode; onClick?: () => void; disabled?: boolean; testId?: string }) {
  return (
    <button className="primary-button" type="button" onClick={onClick} disabled={disabled} data-testid={testId}>
      {children}
    </button>
  );
}

function BottomNav({ flow }: { flow: FlowControls }) {
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <>
      <nav className="bottom-nav" aria-label="Главная навигация">
        <button className="nav-item active" type="button" aria-label="Главная">
          <HomeIcon />
          <span>Главная</span>
        </button>
        <button className="nav-item" type="button" aria-label="Результаты" onClick={() => flow.push(resultsScreen())}>
          <BarChartIcon />
          <span>Результаты</span>
        </button>
        <button className="nav-plus" type="button" aria-label="Новое действие" onClick={() => setQuickOpen(true)}>
          <PlusIcon />
        </button>
        <button className="nav-item" type="button" aria-label="Подписка" onClick={() => flow.push(subscriptionScreen())}>
          <ClockIcon />
          <span>Подписка</span>
        </button>
        <button className="nav-item" type="button" aria-label="Профиль" onClick={() => flow.push(profileScreen())}>
          <PersonIcon />
          <span>Профиль</span>
        </button>
      </nav>
      <BottomSheet
        open={quickOpen}
        onOpenChange={setQuickOpen}
        title="Новый цикл PROBA"
        description="Выберите, с чего начать"
        snap={0.53}
      >
        <div className="sheet-actions">
          <button type="button" onClick={() => { setQuickOpen(false); flow.push(activationScreen()); }}>
            <CameraIcon /><span><strong>Активировать набор</strong><small>По QR-коду или номеру</small></span><ChevronRightIcon />
          </button>
          <button type="button" onClick={() => { setQuickOpen(false); flow.push(kitStoreScreen()); }}>
            <CubeIcon /><span><strong>Купить PROBA Kit</strong><small>Доставка или самовывоз</small></span><ChevronRightIcon />
          </button>
          <button type="button" onClick={() => { setQuickOpen(false); flow.push(courierScreen()); }}>
            <PaperPlaneIcon /><span><strong>Вызвать курьера</strong><small>После забора образца</small></span><ChevronRightIcon />
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

function HomeScreen({ flow }: { flow: FlowControls }) {
  return (
    <MobileScroll className="app-screen">
      <main className="screen-content home-content">
        <header className="home-header">
          <div>
            <span>Добрый день</span>
            <h1>Михаил</h1>
          </div>
          <button className="profile-button" type="button" aria-label="Открыть профиль" onClick={() => flow.push(profileScreen())}>М</button>
        </header>

        <section className="cycle-card" data-testid="active-cycle-card">
          <div className="cycle-card-top">
            <div>
              <span className="eyebrow light">АКТИВНЫЙ ЦИКЛ · PRB-1173</span>
              <h2>Образец принят лабораторией</h2>
            </div>
            <span className="status-dot mint"><CheckIcon /></span>
          </div>
          <div className="cycle-progress" aria-hidden="true">
            <span className="done" /><span className="done" /><span className="done" /><span />
          </div>
          <div className="cycle-card-bottom">
            <span>Сегодня, 14:32</span>
            <button type="button" onClick={() => flow.push(testsScreen())}>Выбрать анализы <ChevronRightIcon /></button>
          </div>
        </section>

        <section className="home-section">
          <SectionTitle title="Что сделать" />
          <div className="action-grid">
            <button type="button" onClick={() => flow.push(activationScreen())}>
              <span className="action-icon blue"><CameraIcon /></span>
              <strong>Активировать набор</strong>
              <small>QR или код</small>
            </button>
            <button type="button" onClick={() => flow.push(kitStoreScreen())}>
              <span className="action-icon mint"><CubeIcon /></span>
              <strong>Купить PROBA Kit</strong>
              <small>2 490 ₽</small>
            </button>
            <button type="button" onClick={() => flow.push(courierScreen())}>
              <span className="action-icon orange"><PaperPlaneIcon /></span>
              <strong>Курьер</strong>
              <small>от 490 ₽</small>
            </button>
            <button type="button" onClick={() => flow.push(labsScreen())}>
              <span className="action-icon violet"><DashboardIcon /></span>
              <strong>Лаборатории</strong>
              <small>3 проверено</small>
            </button>
          </div>
        </section>

        <section className="home-section">
          <SectionTitle title="Ваше здоровье" action={<button className="text-link" type="button" onClick={() => flow.push(resultsScreen())}>Все <ChevronRightIcon /></button>} />
          <div className="health-summary">
            <div><span className="metric-number mint-text">12</span><small>в норме</small></div>
            <div><span className="metric-number orange-text">2</span><small>обсудить</small></div>
            <div><span className="metric-number coral-text">1</span><small>внимание</small></div>
          </div>
          <button className="biomarker-preview" type="button" onClick={() => flow.push(resultsScreen())}>
            <span className="marker-dot coral" />
            <span><strong>Vitamin D</strong><small>24 нг/мл · ниже цели</small></span>
            <ChevronRightIcon />
          </button>
        </section>

        <section className="home-section compact-bottom">
          <SectionTitle eyebrow="ВРАЧИ PROBA" title="Обсудить результаты" />
          <button className="doctor-banner" type="button" onClick={() => flow.push(doctorsScreen())}>
            <span className="doctor-avatar"><PersonIcon /></span>
            <span><strong>Врачи с подтверждённой квалификацией</strong><small>Онлайн-консультация от 1 490 ₽</small></span>
            <ChevronRightIcon />
          </button>
        </section>
      </main>
    </MobileScroll>
  );
}

const homeScreen: FlowScreen = {
  id: "home",
  footer: (flow) => <BottomNav flow={flow} />,
  footerHeight: 84,
  render: (flow) => <HomeScreen flow={flow} />,
};

function KitStore({ flow }: { flow: FlowControls }) {
  const [ordered, setOrdered] = useState(false);
  const [delivery, setDelivery] = useState<"delivery" | "pharmacy">("delivery");

  if (ordered) {
    return (
      <MobileScroll className="app-screen">
        <main className="screen-content success-screen">
          <span className="success-icon"><CheckCircledIcon /></span>
          <Pill tone="mint">ЗАКАЗ PRB-2408</Pill>
          <h1>PROBA Kit забронирован</h1>
          <p>Демо-заказ создан. В рабочей версии здесь появятся оплата, чек и статус доставки.</p>
          <div className="receipt-card">
            <div><span>PROBA Kit</span><strong>2 490 ₽</strong></div>
            <div><span>{delivery === "delivery" ? "Доставка" : "Самовывоз из аптеки"}</span><strong>{delivery === "delivery" ? "0 ₽" : "0 ₽"}</strong></div>
            <div className="receipt-total"><span>Итого</span><strong>2 490 ₽</strong></div>
          </div>
          <PrimaryButton onClick={() => flow.push(activationScreen())}>Активировать уже имеющийся набор</PrimaryButton>
        </main>
      </MobileScroll>
    );
  }

  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content">
        <div className="product-hero">
          <img src="/assets/proba/proba-kit.jpg" alt="Набор PROBA Kit и устройство капиллярного забора" />
          <Pill tone="mint">1 ЦИКЛ</Pill>
          <h1>PROBA Kit</h1>
          <p>Стерильный домашний набор с QR-кодом, микропробиркой и транспортным пакетом.</p>
          <div className="product-price"><strong>2 490 ₽</strong><span>анализы оплачиваются отдельно</span></div>
        </div>

        <section className="page-section">
          <SectionTitle title="Как получить" />
          <div className="segmented-control">
            <button className={delivery === "delivery" ? "selected" : ""} type="button" onClick={() => setDelivery("delivery")}>Курьером</button>
            <button className={delivery === "pharmacy" ? "selected" : ""} type="button" onClick={() => setDelivery("pharmacy")}>В аптеке</button>
          </div>
          <div className="info-card">
            <BackpackIcon />
            <span><strong>{delivery === "delivery" ? "Завтра, 10:00–14:00" : "17 аптек рядом"}</strong><small>{delivery === "delivery" ? "Бесплатная доставка набора" : "Забронируем на 24 часа"}</small></span>
          </div>
        </section>

        <section className="page-section">
          <SectionTitle title="Что внутри" />
          <ul className="check-list">
            <li><CheckIcon /> Устройство капиллярного забора</li>
            <li><CheckIcon /> Микропробирка со стабилизатором</li>
            <li><CheckIcon /> Защитный транспортный пакет</li>
            <li><CheckIcon /> Пошаговая инструкция в приложении</li>
          </ul>
        </section>
        <PrimaryButton onClick={() => setOrdered(true)} testId="order-kit">Забронировать за 2 490 ₽</PrimaryButton>
        <p className="legal-note">Прототип: оплата не производится.</p>
      </main>
    </MobileScroll>
  );
}

function kitStoreScreen() {
  return screen("kit-store", "PROBA Kit", (flow) => <KitStore flow={flow} />);
}

function Activation({ flow }: { flow: FlowControls }) {
  const [code, setCode] = useState("PRB-2408-1173");
  const [active, setActive] = useState(false);

  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content activation-page">
        <div className="scanner-card" aria-hidden="true">
          <CameraIcon />
          <span>Наведите камеру на QR-код</span>
        </div>
        {active ? (
          <>
            <div className="success-banner"><CheckCircledIcon /><span><strong>Набор активирован</strong><small>PRB-1173 связан с вашим профилем</small></span></div>
            <SectionTitle eyebrow="СЛЕДУЮЩИЙ ШАГ" title="Подготовьте цикл" />
            <div className="step-list">
              <div><span>1</span><strong>Выберите время курьера</strong></div>
              <div><span>2</span><strong>Изучите инструкцию</strong></div>
              <div><span>3</span><strong>Соберите образец</strong></div>
            </div>
            <PrimaryButton onClick={() => flow.push(courierScreen())}>Выбрать курьера</PrimaryButton>
          </>
        ) : (
          <>
            <div className="or-divider"><span>или введите код</span></div>
            <label className="code-field" htmlFor="kit-code">
              <span>Код с упаковки</span>
              <KeyboardInput id="kit-code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
            </label>
            <PrimaryButton onClick={() => setActive(true)} disabled={code.length < 8} testId="activate-kit">Активировать набор</PrimaryButton>
            <p className="legal-note">QR связывает физический набор, образец и лабораторную заявку.</p>
          </>
        )}
      </main>
    </MobileScroll>
  );
}

function activationScreen() {
  return screen("activate", "Активация набора", (flow) => <Activation flow={flow} />);
}

function Courier({ flow }: { flow: FlowControls }) {
  const [day, setDay] = useState("Сегодня");
  const [slot, setSlot] = useState("14:00–15:00");
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <MobileScroll className="app-screen">
        <main className="screen-content success-screen">
          <span className="success-icon courier"><PaperPlaneIcon /></span>
          <h1>Курьер назначен</h1>
          <p>{day}, {slot}. Он отсканирует пакет и повезёт образец напрямую в лабораторию.</p>
          <div className="courier-card">
            <span className="courier-avatar">АК</span>
            <span><strong>Алексей К.</strong><small>Рейтинг 4,96 · медицинские отправления</small></span>
            <Pill tone="mint">≈ 25 мин</Pill>
          </div>
          <PrimaryButton onClick={() => flow.push(trackingScreen())}>Открыть трекинг</PrimaryButton>
        </main>
      </MobileScroll>
    );
  }

  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content">
        <div className="context-banner blue-banner">
          <ClockIcon /><span><strong>Сначала слот — потом забор</strong><small>Так образец не будет ждать курьера дольше допустимого окна.</small></span>
        </div>
        <SectionTitle title="День" />
        <div className="date-row">
          {["Сегодня", "Завтра", "31 июл"].map((value) => (
            <button className={day === value ? "selected" : ""} type="button" key={value} onClick={() => setDay(value)}>{value}</button>
          ))}
        </div>
        <SectionTitle title="Время забора" />
        <div className="slot-grid">
          {["10:00–11:00", "12:00–13:00", "14:00–15:00", "16:00–17:00"].map((value) => (
            <button className={slot === value ? "selected" : ""} type="button" key={value} onClick={() => setSlot(value)}>{value}</button>
          ))}
        </div>
        <div className="receipt-card compact">
          <div><span>Забор образца</span><strong>490 ₽</strong></div>
          <div><span>Доставка в лабораторию</span><strong>включена</strong></div>
          <div className="receipt-total"><span>К оплате</span><strong>490 ₽</strong></div>
        </div>
        <PrimaryButton onClick={() => setConfirmed(true)} testId="book-courier">Подтвердить слот</PrimaryButton>
      </main>
    </MobileScroll>
  );
}

function courierScreen() {
  return screen("courier", "Курьер", (flow) => <Courier flow={flow} />);
}

function Tracking({ flow }: { flow: FlowControls }) {
  const statuses = [
    ["Набор активирован", "09:12", true],
    ["Образец собран", "09:38", true],
    ["Курьер забрал", "14:24", true],
    ["Доставлен в PROLAB", "14:32", true],
    ["Ожидает выбора анализов", "сейчас", false],
  ] as const;

  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content">
        <section className="tracking-hero">
          <Pill tone="mint">ДОСТАВЛЕН</Pill>
          <h1>Образец PRB-1173</h1>
          <p>PROLAB · Москва, ул. Академика Королёва, 13</p>
        </section>
        <div className="timeline">
          {statuses.map(([name, time, done]) => (
            <div className={done ? "done" : "current"} key={name}>
              <span className="timeline-point">{done ? <CheckIcon /> : ""}</span>
              <span><strong>{name}</strong><small>{time}</small></span>
            </div>
          ))}
        </div>
        <div className="context-banner mint-banner"><LockClosedIcon /><span><strong>Цепочка сохранена</strong><small>Время каждого этапа записано в журнал образца.</small></span></div>
        <PrimaryButton onClick={() => flow.push(testsScreen())} testId="tracking-to-tests">Выбрать анализы</PrimaryButton>
      </main>
    </MobileScroll>
  );
}

function trackingScreen() {
  return screen("tracking", "Статус образца", (flow) => <Tracking flow={flow} />);
}

function TestsSelection({ flow }: { flow: FlowControls }) {
  const [category, setCategory] = useState("Все");
  const [selected, setSelected] = useState<string[]>(["vitd", "ferritin", "tsh"]);

  const visibleTests = category === "Все" ? tests : tests.filter((item) => item.category === category);
  const subtotal = tests.filter((item) => selected.includes(item.id)).reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + 190;

  const toggle = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const choosePanel = (ids: string[]) => setSelected(ids);

  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content tests-page">
        <div className="context-banner mint-banner">
          <CheckCircledIcon /><span><strong>Образец принят</strong><small>Выберите исследования до 18:00. Цена меняется сразу.</small></span>
        </div>

        <SectionTitle eyebrow="ГОТОВЫЕ ПАНЕЛИ" title="Быстрый выбор" />
        <Carousel ariaLabel="Панели анализов" className="panel-carousel" contentClassName="panel-track">
          <button type="button" onClick={() => choosePanel(["vitd", "b12", "ferritin", "tsh"])}>
            <span className="panel-icon energy"><ActivityLogIcon /></span><strong>Энергия</strong><small>4 показателя · 4 160 ₽</small>
          </button>
          <button type="button" onClick={() => choosePanel(["vitd", "ferritin", "apob", "glucose", "insulin"])}>
            <span className="panel-icon sport"><HeartIcon /></span><strong>Спорт</strong><small>5 показателей · 5 030 ₽</small>
          </button>
          <button type="button" onClick={() => choosePanel(["ferritin", "tsh", "glucose", "insulin"])}>
            <span className="panel-icon balance"><MixerHorizontalIcon /></span><strong>Баланс</strong><small>4 показателя · 2 750 ₽</small>
          </button>
        </Carousel>

        <SectionTitle title="Анализы" action={<Pill tone="blue">{selected.length} выбрано</Pill>} />
        <div className="category-row">
          {["Все", "Витамины", "Сердце", "Метаболизм"].map((value) => (
            <button className={category === value ? "selected" : ""} type="button" key={value} onClick={() => setCategory(value)}>{value}</button>
          ))}
        </div>

        <div className="test-list" data-testid="test-list">
          {visibleTests.map((item) => {
            const checked = selected.includes(item.id);
            return (
              <button
                className={checked ? "selected" : ""}
                type="button"
                key={item.id}
                aria-pressed={checked}
                onClick={() => toggle(item.id)}
              >
                <span className="check-box">{checked ? <CheckIcon /> : null}</span>
                <span><strong>{item.name}</strong><small>{item.category}</small></span>
                <b>{money(item.price)}</b>
              </button>
            );
          })}
        </div>

        <div className="market-price-note"><MagnifyingGlassIcon /> Цены рассчитаны по среднему уровню партнёрских лабораторий Москвы.</div>
        <div className="receipt-card compact">
          <div><span>Исследования · {selected.length}</span><strong>{money(subtotal)}</strong></div>
          <div><span>Обработка заявки</span><strong>190 ₽</strong></div>
          <div className="receipt-total"><span>Итого</span><strong>{money(total)}</strong></div>
        </div>
        <PrimaryButton onClick={() => flow.push(labsScreen(selected, total))} disabled={!selected.length} testId="tests-next">Выбрать лабораторию · {money(total)}</PrimaryButton>
        <p className="legal-note">Финальная цена фиксируется до отправки заявки.</p>
      </main>
    </MobileScroll>
  );
}

function testsScreen() {
  return screen("tests", "Выбор анализов", (flow) => <TestsSelection flow={flow} />);
}

function Labs({ flow, selected, total }: { flow: FlowControls; selected: string[]; total: number }) {
  const [lab, setLab] = useState("prolab");
  const [sent, setSent] = useState(false);
  const chosenTests = tests.filter((item) => selected.includes(item.id));

  if (sent) {
    return (
      <MobileScroll className="app-screen">
        <main className="screen-content success-screen">
          <span className="success-icon"><PaperPlaneIcon /></span>
          <Pill tone="blue">ЗАЯВКА #L-1048</Pill>
          <h1>Отправлено в лабораторию</h1>
          <p>Специалист проверит состав заявки и образец. Ожидаем подтверждение в течение 15 минут.</p>
          <div className="receipt-card">
            <div><span>Исследования</span><strong>{chosenTests.length}</strong></div>
            <div><span>Лаборатория</span><strong>{lab === "prolab" ? "PROLAB" : lab === "medline" ? "МедЛайн" : "Баланс"}</strong></div>
            <div className="receipt-total"><span>Заказ</span><strong>{money(total)}</strong></div>
          </div>
          <PrimaryButton onClick={() => flow.push(labOrderScreen(chosenTests, total))}>Статус заявки</PrimaryButton>
        </main>
      </MobileScroll>
    );
  }

  const labs = [
    { id: "prolab", name: "PROLAB", city: "Москва · 24–36 часов", rating: "4,9", badge: "Быстрее" },
    { id: "medline", name: "МедЛайн Диагностика", city: "Москва · 36–48 часов", rating: "4,8", badge: "Рядом" },
    { id: "balance", name: "Клиника Баланс", city: "Москва · 24–48 часов", rating: "4,9", badge: "Врач онлайн" },
  ];

  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content">
        <div className="context-banner blue-banner"><IdCardIcon /><span><strong>Только проверенные партнёры</strong><small>Для каждой лаборатории показываем статус лицензии и SLA.</small></span></div>
        <SectionTitle title="Куда отправить заявку" />
        <div className="lab-list" data-testid="lab-list">
          {labs.map((item) => (
            <button className={lab === item.id ? "selected" : ""} type="button" key={item.id} onClick={() => setLab(item.id)}>
              <span className="lab-logo"><DashboardIcon /></span>
              <span><strong>{item.name} <CheckCircledIcon /></strong><small>{item.city}</small><em>Лицензия проверена · рейтинг {item.rating}</em></span>
              <Pill tone={item.id === "prolab" ? "mint" : "gray"}>{item.badge}</Pill>
            </button>
          ))}
        </div>

        <SectionTitle title="Состав заявки" />
        <div className="order-summary-list">
          {chosenTests.map((item) => <div key={item.id}><span>{item.name}</span><strong>{money(item.price)}</strong></div>)}
        </div>
        <div className="receipt-card compact">
          <div><span>Заказ</span><strong>{money(total)}</strong></div>
          <div><span>Изменение цены</span><strong className="mint-text">0 ₽</strong></div>
        </div>
        <PrimaryButton onClick={() => setSent(true)} testId="send-to-lab">Отправить заявку</PrimaryButton>
      </main>
    </MobileScroll>
  );
}

function labsScreen(selected: string[] = ["vitd", "ferritin", "tsh"], total = 3360) {
  return screen("labs", "Лаборатории", (flow) => <Labs flow={flow} selected={selected} total={total} />);
}

function LabOrder({ flow, chosenTests, total }: { flow: FlowControls; chosenTests: TestItem[]; total: number }) {
  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content">
        <section className="tracking-hero">
          <Pill tone="orange">НА ПРОВЕРКЕ</Pill>
          <h1>Заявка #L-1048</h1>
          <p>PROLAB получила состав исследований и образец PRB-1173.</p>
        </section>
        <div className="timeline compact-timeline">
          <div className="done"><span className="timeline-point"><CheckIcon /></span><span><strong>Образец принят</strong><small>14:32</small></span></div>
          <div className="done"><span className="timeline-point"><CheckIcon /></span><span><strong>Заявка отправлена</strong><small>14:41</small></span></div>
          <div className="current"><span className="timeline-point" /><span><strong>Проверка лабораторией</strong><small>до 15 минут</small></span></div>
          <div><span className="timeline-point" /><span><strong>Исследование</strong><small>после подтверждения</small></span></div>
        </div>
        <div className="receipt-card compact">
          <div><span>Показателей</span><strong>{chosenTests.length}</strong></div>
          <div><span>Сумма</span><strong>{money(total)}</strong></div>
        </div>
        <button className="secondary-button" type="button" onClick={() => flow.push(labAdminScreen(chosenTests, total))}>Открыть демо админки лаборатории</button>
        <PrimaryButton onClick={() => flow.push(resultsScreen())}>Посмотреть демо результатов</PrimaryButton>
      </main>
    </MobileScroll>
  );
}

function labOrderScreen(chosenTests: TestItem[], total: number) {
  return screen("lab-order", "Статус заявки", (flow) => <LabOrder flow={flow} chosenTests={chosenTests} total={total} />);
}

function LabAdmin({ flow, chosenTests, total }: { flow: FlowControls; chosenTests: TestItem[]; total: number }) {
  const [status, setStatus] = useState<"new" | "accepted" | "ready">("new");

  return (
    <MobileScroll className="app-screen lab-admin-screen">
      <main className="screen-content page-content">
        <div className="partner-mode"><DashboardIcon /><span><strong>PROLAB · кабинет партнёра</strong><small>Демонстрационный режим</small></span></div>
        <SectionTitle eyebrow="НОВАЯ ЗАЯВКА" title="#L-1048" action={<Pill tone={status === "new" ? "orange" : "mint"}>{status === "new" ? "Новая" : status === "accepted" ? "Принята" : "Готово"}</Pill>} />
        <div className="admin-card">
          <div><span>Образец</span><strong>PRB-1173</strong></div>
          <div><span>Клиент</span><strong>PROBA-8F2A</strong></div>
          <div><span>Поступил</span><strong>14:32</strong></div>
          <div><span>Температура</span><strong className="mint-text">SLA соблюдён</strong></div>
        </div>
        <SectionTitle title="Исследования" />
        <div className="order-summary-list">
          {chosenTests.map((item) => <div key={item.id}><span>{item.name}</span><strong>{money(item.price)}</strong></div>)}
        </div>
        <div className="receipt-card compact"><div className="receipt-total"><span>Стоимость заявки</span><strong>{money(total)}</strong></div></div>
        {status === "new" ? <PrimaryButton onClick={() => setStatus("accepted")} testId="lab-accept">Принять заявку</PrimaryButton> : null}
        {status === "accepted" ? <PrimaryButton onClick={() => setStatus("ready")} testId="lab-ready">Загрузить демо результатов</PrimaryButton> : null}
        {status === "ready" ? (
          <div className="success-banner"><CheckCircledIcon /><span><strong>Результаты опубликованы</strong><small>Клиент получил безопасное уведомление.</small></span></div>
        ) : null}
        <button className="secondary-button" type="button" onClick={() => flow.push(resultsScreen())}>Перейти в клиентское приложение</button>
      </main>
    </MobileScroll>
  );
}

function labAdminScreen(chosenTests: TestItem[] = tests.slice(0, 3), total = 3560) {
  return screen("lab-admin", "Кабинет лаборатории", (flow) => <LabAdmin flow={flow} chosenTests={chosenTests} total={total} />);
}

function ResultCard({ name, value, reference, tone, status, position }: { name: string; value: string; reference: string; tone: "mint" | "orange" | "coral"; status: string; position: string }) {
  return (
    <article className="result-card">
      <div><h3>{name}</h3><Pill tone={tone === "coral" ? "orange" : tone}>{status}</Pill></div>
      <div className="result-value"><strong className={`${tone}-text`}>{value}</strong><span>{reference}</span></div>
      <div className={`range-bar ${tone}`}><span style={{ left: position }} /></div>
    </article>
  );
}

function Results({ flow }: { flow: FlowControls }) {
  return (
    <MobileScroll className="app-screen">
      <main className="screen-content results-content">
        <div className="results-summary">
          <div><span className="mint-dot" />12 в норме</div>
          <div><span className="orange-dot" />2 обсудить</div>
          <div><span className="coral-dot" />1 внимание</div>
        </div>
        <SectionTitle title="Биомаркеры" action={<Pill tone="gray">18 июля</Pill>} />
        <div className="results-list">
          <ResultCard name="Vitamin D" value="24 нг/мл" reference="цель 30–60" tone="coral" status="ниже цели" position="28%" />
          <ResultCard name="Ферритин" value="68 мкг/л" reference="30–150" tone="mint" status="в норме" position="49%" />
          <ResultCard name="ApoB" value="1.02 г/л" reference="цель < 0.9" tone="orange" status="погранично" position="71%" />
          <ResultCard name="ТТГ" value="2.1 мМЕ/л" reference="0.4–4.0" tone="mint" status="в норме" position="46%" />
        </div>
        <button className="doctor-callout" type="button" onClick={() => flow.push(doctorsScreen())}>
          <span><strong>Обсудить Vitamin D со специалистом</strong><small>Врач увидит только результаты, к которым вы дадите доступ.</small></span>
          <ChevronRightIcon />
        </button>
        <div className="result-actions">
          <button type="button"><FileTextIcon /> Отчёт для врача</button>
          <button type="button" onClick={() => flow.push(subscriptionScreen())}><BellIcon /> Следующий цикл</button>
        </div>
      </main>
    </MobileScroll>
  );
}

function resultsScreen() {
  return screen("results", "Результаты", (flow) => <Results flow={flow} />);
}

function Doctors({ flow }: { flow: FlowControls }) {
  const doctors = [
    { id: "gromova", initials: "АГ", name: "Анна Громова", role: "Терапевт · превентивная медицина", exp: "12 лет", price: 1490, next: "сегодня 18:30" },
    { id: "karimov", initials: "РК", name: "Руслан Каримов", role: "Эндокринолог", exp: "9 лет", price: 1790, next: "завтра 10:00" },
    { id: "sokolova", initials: "ЕС", name: "Елена Соколова", role: "Врач спортивной медицины", exp: "14 лет", price: 1990, next: "завтра 12:30" },
  ];

  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content">
        <div className="context-banner blue-banner"><IdCardIcon /><span><strong>Квалификация проверена</strong><small>Документы врача и клиника-партнёр подтверждаются до публикации.</small></span></div>
        <SectionTitle title="Выберите врача" />
        <div className="doctor-list">
          {doctors.map((doctor) => (
            <button type="button" key={doctor.id} onClick={() => flow.push(doctorDetailScreen(doctor))}>
              <span className="doctor-photo">{doctor.initials}</span>
              <span><strong>{doctor.name} <CheckCircledIcon /></strong><small>{doctor.role}</small><em>{doctor.exp} опыта · {doctor.next}</em></span>
              <b>{money(doctor.price)}</b>
            </button>
          ))}
        </div>
        <div className="legal-card"><LockClosedIcon /><p>Врач получит доступ к выбранным результатам только после вашего подтверждения.</p></div>
      </main>
    </MobileScroll>
  );
}

function doctorsScreen() {
  return screen("doctors", "Врачи PROBA", (flow) => <Doctors flow={flow} />);
}

type Doctor = { id: string; initials: string; name: string; role: string; exp: string; price: number; next: string };

function DoctorDetail({ flow, doctor }: { flow: FlowControls; doctor: Doctor }) {
  const [booked, setBooked] = useState(false);

  if (booked) {
    return (
      <MobileScroll className="app-screen">
        <main className="screen-content success-screen">
          <span className="doctor-photo large">{doctor.initials}</span>
          <Pill tone="mint">ЗАПИСЬ ПОДТВЕРЖДЕНА</Pill>
          <h1>{doctor.name}</h1>
          <p>Сегодня, 18:30 · онлайн. За 10 минут бот пришлёт безопасную ссылку на консультацию.</p>
          <PrimaryButton onClick={() => flow.push(doctorRecommendationScreen())}>Посмотреть демо рекомендации</PrimaryButton>
        </main>
      </MobileScroll>
    );
  }

  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content">
        <div className="doctor-profile-card">
          <span className="doctor-photo large">{doctor.initials}</span>
          <h1>{doctor.name} <CheckCircledIcon /></h1>
          <p>{doctor.role}</p>
          <div><span><strong>{doctor.exp}</strong><small>опыт</small></span><span><strong>4,9</strong><small>рейтинг</small></span><span><strong>1 200+</strong><small>приёмов</small></span></div>
        </div>
        <SectionTitle title="Доступ врачу" />
        <div className="consent-card">
          <label><span>Результаты от 18 июля</span><input type="checkbox" defaultChecked /></label>
          <label><span>Динамика за 6 месяцев</span><input type="checkbox" defaultChecked /></label>
          <label><span>Профиль и цели</span><input type="checkbox" /></label>
        </div>
        <div className="receipt-card compact"><div><span>Онлайн-консультация</span><strong>{money(doctor.price)}</strong></div><div><span>Ближайшее время</span><strong>Сегодня 18:30</strong></div></div>
        <PrimaryButton onClick={() => setBooked(true)} testId="book-doctor">Записаться за {money(doctor.price)}</PrimaryButton>
      </main>
    </MobileScroll>
  );
}

function doctorDetailScreen(doctor: Doctor) {
  return screen(`doctor-${doctor.id}`, "Профиль врача", (flow) => <DoctorDetail flow={flow} doctor={doctor} />);
}

function DoctorRecommendation({ flow }: { flow: FlowControls }) {
  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content">
        <div className="recommendation-head">
          <span className="doctor-photo">АГ</span>
          <span><strong>Анна Громова <CheckCircledIcon /></strong><small>Рекомендация после консультации · 18 июля</small></span>
        </div>
        <div className="medical-note">
          <Pill tone="orange">VITAMIN D</Pill>
          <h2>Обсудили коррекцию уровня</h2>
          <p>Контрольный анализ через 8–12 недель. Товар ниже добавлен врачом в персональный план, но решение о покупке остаётся за вами.</p>
        </div>
        <SectionTitle title="Рекомендованные товары" />
        <div className="product-list compact-products">
          {products.filter((item) => item.recommended).map((item) => (
            <article key={item.id}>
              <span className={`product-icon ${item.id}`}><BackpackIcon /></span>
              <span><Pill tone="mint">от врача</Pill><strong>{item.name}</strong><small>{item.meta}</small></span>
              <b>{money(item.price)}</b>
            </article>
          ))}
        </div>
        <PrimaryButton onClick={() => flow.push(storeScreen(true))}>Открыть витрину и купить</PrimaryButton>
        <p className="legal-note">Товары не являются лекарственными средствами и не заменяют консультацию врача.</p>
      </main>
    </MobileScroll>
  );
}

function doctorRecommendationScreen() {
  return screen("doctor-recommendation", "Рекомендация врача", (flow) => <DoctorRecommendation flow={flow} />);
}

function Store({ fromDoctor }: { fromDoctor: boolean }) {
  const [cart, setCart] = useState<string[]>([]);

  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content store-page">
        {fromDoctor ? (
          <div className="context-banner mint-banner"><CheckCircledIcon /><span><strong>Персональный план врача</strong><small>Рекомендованные позиции отмечены. Купить можно и отдельно.</small></span></div>
        ) : (
          <div className="context-banner blue-banner"><BackpackIcon /><span><strong>Витрина партнёрских аптек</strong><small>Рекомендация врача не обязательна для просмотра каталога.</small></span></div>
        )}
        <SectionTitle title={fromDoctor ? "Рекомендовано вам" : "Каталог"} action={<Pill tone={cart.length ? "mint" : "gray"}>Корзина · {cart.length}</Pill>} />
        <div className="product-list">
          {products.map((item) => {
            const added = cart.includes(item.id);
            return (
              <article key={item.id}>
                <span className={`product-icon ${item.id}`}><BackpackIcon /></span>
                <span>{item.recommended && fromDoctor ? <Pill tone="mint">от врача</Pill> : null}<strong>{item.name}</strong><small>{item.meta}</small></span>
                <b>{money(item.price)}</b>
                <button className={added ? "added" : ""} type="button" onClick={() => setCart((current) => added ? current.filter((id) => id !== item.id) : [...current, item.id])}>{added ? "Добавлено" : "В корзину"}</button>
              </article>
            );
          })}
        </div>
        <div className="store-disclosure"><ReaderIcon /> Рекомендации врача и коммерческая витрина разделены. Партнёр товара всегда указан.</div>
      </main>
    </MobileScroll>
  );
}

function storeScreen(fromDoctor = false) {
  return screen("store", "Витрина PROBA", () => <Store fromDoctor={fromDoctor} />);
}

function Subscription() {
  const [frequency, setFrequency] = useState("12");
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <MobileScroll className="app-screen">
        <main className="screen-content success-screen subscription-success">
          <span className="success-icon"><BellIcon /></span>
          <Pill tone="mint">PROBA CYCLE</Pill>
          <h1>Следующий цикл запланирован</h1>
          <p>Через {frequency} недель. За 7 дней напомним, уточним адрес и только после подтверждения подготовим новый набор.</p>
          <div className="receipt-card">
            <div><span>Набор + курьер + трекинг</span><strong>2 690 ₽/цикл</strong></div>
            <div><span>Анализы</span><strong>−10%</strong></div>
            <div><span>Пропуск цикла</span><strong className="mint-text">бесплатно</strong></div>
          </div>
          <button className="secondary-button" type="button">Пропустить следующий цикл</button>
        </main>
      </MobileScroll>
    );
  }

  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content subscription-page">
        <div className="subscription-hero">
          <Pill tone="mint">PROBA CYCLE</Pill>
          <h1>Регулярно, но без ловушки подписки</h1>
          <p>Новый набор готовится только после вашего подтверждения. Анализы выбираются и оплачиваются отдельно.</p>
        </div>
        <SectionTitle title="Как часто напоминать" />
        <div className="frequency-list">
          {[
            ["8", "Каждые 8 недель", "После рекомендации врача"],
            ["12", "Каждые 12 недель", "Оптимально для регулярного контроля"],
            ["24", "Раз в 6 месяцев", "Базовый мониторинг"],
          ].map(([id, title, text]) => (
            <button className={frequency === id ? "selected" : ""} type="button" key={id} onClick={() => setFrequency(id)}>
              <span className="radio-dot" /><span><strong>{title}</strong><small>{text}</small></span>{id === "12" ? <Pill tone="mint">Популярно</Pill> : null}
            </button>
          ))}
        </div>
        <div className="subscription-price-card">
          <span><small>за один цикл</small><strong>2 690 ₽</strong></span>
          <ul><li><CheckIcon /> PROBA Kit</li><li><CheckIcon /> курьер и трекинг</li><li><CheckIcon /> напоминания</li><li><CheckIcon /> скидка 10% на анализы</li></ul>
        </div>
        <div className="context-banner blue-banner"><CalendarIcon /><span><strong>Списание за 3 дня</strong><small>Перед каждым циклом — подтверждение, пауза или пропуск в один тап.</small></span></div>
        <PrimaryButton onClick={() => setActive(true)} testId="activate-subscription">Запланировать цикл</PrimaryButton>
        <p className="legal-note">Прототип: банковская карта не привязывается.</p>
      </main>
    </MobileScroll>
  );
}

function subscriptionScreen() {
  return screen("subscription", "Подписка", () => <Subscription />);
}

function Profile({ flow }: { flow: FlowControls }) {
  return (
    <MobileScroll className="app-screen">
      <main className="screen-content page-content">
        <div className="profile-card">
          <span className="profile-large">М</span>
          <span><h1>Михаил</h1><p>Профиль PROBA · Москва</p></span>
        </div>
        <SectionTitle title="Мои данные" />
        <div className="settings-list">
          <button type="button"><IdCardIcon /><span><strong>Профиль и согласия</strong><small>Данные, цели, доступ врачей</small></span><ChevronRightIcon /></button>
          <button type="button"><BellIcon /><span><strong>Уведомления</strong><small>Статусы и напоминания</small></span><ChevronRightIcon /></button>
          <button type="button" onClick={() => flow.push(storeScreen())}><BackpackIcon /><span><strong>Витрина товаров</strong><small>Покупка с рекомендацией или отдельно</small></span><ChevronRightIcon /></button>
        </div>
        <SectionTitle eyebrow="ДЛЯ ПАРТНЁРОВ" title="Демонстрационные кабинеты" />
        <div className="partner-demo-grid">
          <button type="button" onClick={() => flow.push(labAdminScreen())}><DashboardIcon /><span><strong>Лаборатория</strong><small>Приём заявки и результатов</small></span></button>
          <button type="button" onClick={() => flow.push(doctorRecommendationScreen())}><PersonIcon /><span><strong>Врач</strong><small>Верификация и рекомендация</small></span></button>
        </div>
        <div className="legal-card"><LockClosedIcon /><p>Это интерактивный прототип. Медицинские и платёжные данные не сохраняются.</p></div>
      </main>
    </MobileScroll>
  );
}

function profileScreen() {
  return screen("profile", "Профиль", (flow) => <Profile flow={flow} />);
}

export default function Prototype() {
  return <FlowStack initial={homeScreen} />;
}
