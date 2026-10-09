import { useEffect, useState } from "react";
import styles from "./App.module.css";
import SiteHeader from "./components/siteHeader";
import SiteFooter from "./components/siteFooter";
import BackToTop from "./components/backToTop";
import EmiCalculator from "./components/emiCalculator";

const repository = "https://github.com/a2rp/emi-calculator";

const App = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <div className={styles["app-shell"]} id="top">
            <SiteHeader title="ClearRate" mark="C" navItems={[["Calculator", "#workspace"], ["Repayment plan", "#schedule"]]} repoUrl={repository} />
            <main className={styles["page-content"]}><EmiCalculator /></main>
            <SiteFooter repoUrl={repository} />
            <BackToTop visible={showBackToTop} />
        </div>
    );
};
export default App;