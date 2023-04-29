import React from "react";
import "./App.scss";
function getDifficultyTarget(lastStats: any) {
  return lastStats.config.avgDifficultyTargetEnabled
    ? lastStats.network.difficultyTarget || lastStats.config.coinDifficultyTarget
    : lastStats.config.coinDifficultyTarget;
}
const useGetStats = () => {
  const [heroStats, setHeroStats] = React.useState({ globalPower: 0, difficulty: 0, globalPower_gh: 0, tokenPrice: 0 });
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const fetchHero = async () => {
      const heroMinersStatsResponse = await fetch("https://ironfish.herominers.com/api/stats");
      const heroMinersStatsResponseData = await heroMinersStatsResponse.json();
      const difficultyTarget = getDifficultyTarget(heroMinersStatsResponseData);
      const globalPower = heroMinersStatsResponseData.network.difficulty / difficultyTarget / 1000000000000000;
      setHeroStats({
        globalPower,
        globalPower_gh: globalPower * 1000 * 1000,
        difficulty: heroMinersStatsResponseData.network.difficulty / 1000000000000000,
        tokenPrice: heroMinersStatsResponseData.pool.price.usd,
      });
    };
    fetchHero();
    setTimeout(() => {
      setCount(count + 1);
    }, 5000);
  }, [count]);
  return {
    heroStats,
  };
};
export default function App() {
  const [power, setPower] = React.useState<number>(18);
  const [consumption, setConsumption] = React.useState<number>(300);
  const [electricityPrice, setElectricityPrice] = React.useState<number>(0.7);
  const {
    heroStats: { globalPower, difficulty, globalPower_gh, tokenPrice },
  } = useGetStats();
  const dailyOutput = (power / globalPower_gh) * 28800;
  return (
    <>
      <h1>IRON FISH 挖矿铁鱼成本计算器</h1>
      <article className="ironfish-global-power">
        当前全网算力： {Number(globalPower).toFixed(2)} PH/S <span>({Number(globalPower_gh).toFixed(2)} GH/S)</span>
        <p>当前全网算力难度： {Number(difficulty).toFixed(2)} PH</p>
        <p>当前币价：{Number(tokenPrice).toFixed(2)} USD</p>
        <p>
          3080显卡：
          <br />
          <span>
            算力<span>（大概值）</span>：
            <input value={power} onChange={(e) => setPower(parseFloat(e.target.value))} /> GH/S
          </span>
          <br />
          <span>
            功耗<span>（大概值）</span>：
            <input value={consumption} onChange={(e) => setConsumption(parseFloat(e.target.value))} />w
          </span>
          <br />
          <span>一天耗电度数：{(consumption * 24) / 1000} 度</span>
        </p>
        <p>
          电价：
          <input value={electricityPrice} onChange={(e) => setElectricityPrice(parseFloat(e.target.value))} />
          <span>（人民币）</span>
        </p>
      </article>

      <main className="ironfish">
        <div>
          <h2>按总算力耗电估计</h2>
          <p>预估全网3080挖矿显卡数量</p>
          <span>
            {Number(globalPower_gh).toFixed(2)} / {power} = {Number(globalPower_gh / power).toFixed(2)} 张显卡
          </span>
          <p>
            总算力耗电估计
            <span>（度数）</span>
          </p>
          <span>
            {Number(globalPower_gh / power).toFixed(2)} * {(consumption * 24) / 1000} ={" "}
            {Number(((globalPower_gh / power) * (consumption * 24)) / 1000).toFixed(2)} 度
          </span>
          <p>总算力耗电费用估计：</p>
          <span>
            {Number(((globalPower_gh / power) * (consumption * 24)) / 1000).toFixed(2)} * {electricityPrice} ={" "}
            {Number((((globalPower_gh / power) * (consumption * 24)) / 1000) * electricityPrice).toFixed(2)} RMB ={" "}
            {Number(((((globalPower_gh / power) * (consumption * 24)) / 1000) * electricityPrice) / 6.8).toFixed(2)} USD
          </span>
          <p>每天恒定产出2.88w个币</p>
          <span>
            {Number(((((globalPower_gh / power) * (consumption * 24)) / 1000) * electricityPrice) / 6.8).toFixed(2)} /
            28800 = 每个币{" "}
            {Number(
              ((((globalPower_gh / power) * (consumption * 24)) / 1000) * electricityPrice) / 6.8 / 28800
            ).toFixed(2)}{" "}
            美元
          </span>
          <section>
            每个币产出成本{" "}
            <span>
              {Number(
                ((((globalPower_gh / power) * (consumption * 24)) / 1000) * electricityPrice) / 6.8 / 28800
              ).toFixed(2)}
            </span>{" "}
            USD
          </section>
        </div>
        <div>
          <h2>按产出收益耗电估计</h2>
          <p>币本位每日产出：{Number(dailyOutput).toFixed(2)} IRON</p>
          <p>
            每日收益：{Number(dailyOutput).toFixed(2)} * {Number(tokenPrice).toFixed(2)} ={" "}
            {Number(dailyOutput * tokenPrice * 6.8).toFixed(2)} RMB = {Number(dailyOutput * tokenPrice).toFixed(2)} USD
          </p>
          <p>
            当前挖矿产出币价：{Number(tokenPrice).toFixed(2)} / {Number(dailyOutput).toFixed(2)} ={" "}
            {Number(tokenPrice / dailyOutput).toFixed(2)} RMB = {Number(tokenPrice / dailyOutput / 6.8).toFixed(2)} USD
          </p>
          <section>
            每个币产出成本 <span>{Number(tokenPrice / dailyOutput / 6.8).toFixed(2)}</span> USD
          </section>
        </div>
      </main>
    </>
  );
}
