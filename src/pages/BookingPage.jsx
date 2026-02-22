import { useEffect, useState } from "react";
import { getBookingCalendar, getBookingConfig, sendBookingRequest } from "../api/client";
import { useI18n } from "../context/I18nContext";

export default function BookingPage() {
  const { t } = useI18n();
  const [config, setConfig] = useState(null);
  const [calendar, setCalendar] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getBookingConfig().then(setConfig);
    getBookingCalendar().then(setCalendar);
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const payload = Object.fromEntries(formData.entries());
    const result = await sendBookingRequest(payload);
    setStatus(result.message);
    formEl.reset();
  }

  if (!config) {
    return <section className="container section">{t("common.loading")}</section>;
  }

  return (
    <section className="container section">
      <h1>{t("booking.title")}</h1>
      <p>
        {t("booking.status")}: {config.bookingEnabled ? t("booking.open") : t("booking.closed")}
      </p>
      <p>
        {t("booking.source")}: {config.source}
      </p>
      <p>{config.calendarNote}</p>

      <h2>{t("booking.promos")}</h2>
      <div className="card-row">
        {config.promotionRules.map((promo) => (
          <article className="card" key={promo.id}>
            <h3>{promo.title}</h3>
            <p>{promo.description}</p>
          </article>
        ))}
      </div>

      {calendar && (
        <div className="card-row three-col">
          {calendar.months.map((item) => (
            <article className="card" key={item.month}>
              <h3>{item.month}</h3>
              <p>{t("booking.occupancy")}: {Math.round(item.occupancy * 100)}%</p>
            </article>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="form">
        <h2>{t("booking.inquiry")}</h2>
        <input name="name" placeholder={t("booking.name")} required />
        <input name="email" type="email" placeholder={t("booking.email")} required />
        <input name="from" type="date" title={t("booking.from")} required />
        <input name="to" type="date" title={t("booking.to")} required />
        <input name="guests" type="number" min="1" max="8" placeholder={t("booking.guests")} required />
        <input name="promoCode" placeholder={t("booking.promoCode")} />
        <button type="submit" className="cta-btn inline-cta">
          {t("booking.send")}
        </button>
      </form>

      {status && <p className="success">{status}</p>}
    </section>
  );
}

