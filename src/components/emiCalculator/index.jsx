import { useMemo, useState } from "react";
import { FiActivity, FiBriefcase, FiHome, FiInfo, FiRotateCcw, FiUser } from "react-icons/fi";
import styles from "./styles.module.css";

const presets = [
    { name: "Home loan", icon: FiHome, principal: 4500000, rate: 8.5, years: 20 },
    { name: "Car loan", icon: FiBriefcase, principal: 1200000, rate: 9.2, years: 5 },
    { name: "Personal", icon: FiUser, principal: 500000, rate: 12.5, years: 3 },
];
const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);

const EmiCalculator = () => {
    const [principal, setPrincipal] = useState(4500000);
    const [annualRate, setAnnualRate] = useState(8.5);
    const [years, setYears] = useState(20);
    const calculation = useMemo(() => {
        const months = Math.max(1, years * 12);
        const monthlyRate = annualRate / 1200;
        const payment = monthlyRate === 0 ? principal / months : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
        const total = payment * months;
        const schedule = Array.from({ length: Math.min(6, months) }, (_, index) => index).reduce((rows, index) => {
            const balance = index === 0 ? principal : rows[index - 1].balance;
            const interest = balance * monthlyRate;
            const principalPaid = payment - interest;
            return [...rows, { month: index + 1, payment, principalPaid, interest, balance: Math.max(0, balance - principalPaid) }];
        }, []);
        return { payment, total, interest: total - principal, schedule };
    }, [principal, annualRate, years]);
    const choosePreset = (preset) => {
        setPrincipal(preset.principal);
        setAnnualRate(preset.rate);
        setYears(preset.years);
    };

    return (
        <section className={styles.emiCalculator} id="workspace">
            <div className={styles.hero}>
                <div><p className={styles.context}>LOAN PAYMENT ESTIMATOR</p><h1>Know the cost<br /><span>before signing.</span></h1><p className={styles.description}>See how your loan amount, rate, and term shape each monthly payment.</p></div>
                <div className={styles.heroNote}><FiActivity aria-hidden="true" /><div><strong>Simple estimate</strong><span>Monthly reducing balance</span></div></div>
            </div>
            <div className={styles.presetRow} role="group" aria-label="Choose a loan example">
                {presets.map((preset) => {
                    const Icon = preset.icon;
                    const selected = principal === preset.principal && annualRate === preset.rate && years === preset.years;
                    return <button className={selected ? styles.selectedPreset : ""} type="button" key={preset.name} onClick={() => choosePreset(preset)} aria-pressed={selected}><Icon aria-hidden="true" />{preset.name}</button>;
                })}
                <button className={styles.resetButton} type="button" onClick={() => choosePreset(presets[0])}><FiRotateCcw aria-hidden="true" /> Reset</button>
            </div>
            <div className={styles.workspace}>
                <section className={styles.inputPanel} aria-label="Loan details">
                    <div className={styles.panelHeading}><div><h2>Your loan details</h2><p>Adjust the values to explore a different plan.</p></div><span className={styles.step}>01 / 02</span></div>
                    <label className={styles.field}><span>Loan amount</span><div className={styles.numberInput}><span>₹</span><input type="number" min="0" max="100000000" step="10000" value={principal} onChange={(event) => setPrincipal(Math.max(0, Number(event.target.value)))} /></div><input className={styles.range} type="range" aria-label="Loan amount slider" min="100000" max="10000000" step="50000" value={Math.min(10000000, Math.max(100000, principal))} onChange={(event) => setPrincipal(Number(event.target.value))} /><div className={styles.rangeLabels}><span>₹1 lakh</span><span>₹1 crore</span></div></label>
                    <div className={styles.twoFields}>
                        <label className={styles.field}><span>Annual interest rate</span><div className={styles.suffixInput}><input type="number" min="0" max="30" step="0.05" value={annualRate} onChange={(event) => setAnnualRate(Math.max(0, Number(event.target.value)))} /><span>%</span></div><small>Fixed rate used for this estimate</small></label>
                        <label className={styles.field}><span>Loan term</span><div className={styles.suffixInput}><input type="number" min="1" max="40" value={years} onChange={(event) => setYears(Math.min(40, Math.max(1, Number(event.target.value))))} /><span>years</span></div><small>{years * 12} monthly payments</small></label>
                    </div>
                    <div className={styles.note}><FiInfo aria-hidden="true" /><p>This estimate excludes lender fees, insurance, and rate changes. Check your loan offer for the final amount.</p></div>
                </section>
                <aside className={styles.resultPanel} aria-live="polite">
                    <p className={styles.resultLabel}>YOUR ESTIMATED MONTHLY EMI</p><strong className={styles.emiAmount}>{money(calculation.payment)}</strong><span className={styles.perMonth}>per month for {years} years</span>
                    <div className={styles.totalBox}><div><span>Principal</span><strong>{money(principal)}</strong></div><div><span>Total interest</span><strong>{money(calculation.interest)}</strong></div><div className={styles.totalDue}><span>Total repayment</span><strong>{money(calculation.total)}</strong></div></div>
                    <div className={styles.splitTitle}><span>Repayment mix</span><span>{principal > 0 ? Math.round((principal / calculation.total) * 100) : 0}% principal</span></div>
                    <div className={styles.splitBar} aria-label="Principal and interest proportion"><span style={{ width: (calculation.total ? (principal / calculation.total) * 100 : 0) + "%" }} /></div>
                    <div className={styles.legend}><span><i /> Principal</span><span><i /> Interest</span></div>
                </aside>
            </div>
            <section className={styles.schedule} id="schedule">
                <div className={styles.scheduleHeading}><div><p className={styles.context}>FIRST SIX PAYMENTS</p><h2>How the balance changes</h2><p>Each payment covers interest first, then reduces what you owe.</p></div><span>{years * 12} total payments</span></div>
                <div className={styles.tableWrap}><table><thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>{calculation.schedule.map((row) => <tr key={row.month}><td>Month {row.month}</td><td>{money(row.payment)}</td><td>{money(row.principalPaid)}</td><td>{money(row.interest)}</td><td>{money(row.balance)}</td></tr>)}</tbody></table></div>
                <p className={styles.scheduleFootnote}>Amounts are rounded to the nearest rupee. Your lender may calculate a slightly different schedule.</p>
            </section>
        </section>
    );
};
export default EmiCalculator;