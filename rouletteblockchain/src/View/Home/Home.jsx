import { useEffect, useState } from "react";
import Header from "../../Components/header/header";
import Roulette from "../../Components/tableau/Roulette";
import "./home.scss"
import Jeton from "../../Components/money/Jeton";

import TokenABI from "../../utils/TokenABI.json";
import useAdvancedState from "../../utils/CustomHooks/useAdvencedState";
import Web3 from "web3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const tokenAddress = "0x12aa00da1B8c2f1Aed531BDb8aBA4464953707A8"; // Adresse du contrat du token ERC-20
const tokenAbi = TokenABI; // Interface de contrat du token ERC-20

function Home() {
    const [loading, setLoading] = useState(false);

    const [info, setInfo] = useAdvancedState({
        balance: ''
    })

    const [selectedValue, setSelectedValue] = useState("")
    const [placements, setPlacements] = useState([])

    useEffect(() => {
        getData();
    }, [])

    async function getData() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum);
        const accounts = await window.web3.eth.getAccounts();
        const address = accounts[0];
        const tokenContract = new window.web3.eth.Contract(tokenAbi, tokenAddress);
        const tokenBalance = await tokenContract.methods.balanceOf(address).call();
        console.log(tokenBalance)
        console.log(window.web3)
        setInfo({
            balance: window.web3.utils.fromWei(tokenBalance, "ether")
        })
        setLoading(true)
    }

    function handleClickJeton(value) {
        console.log(info.balance)
        setSelectedValue(value)
    }
    function handleChangeRoulette(value) {
        if (selectedValue !== "") {
            let previousBalance = parseInt(info.balance)
            let removeMoney = parseInt(selectedValue)

            let newBalance = previousBalance - removeMoney
            setInfo({ balance: newBalance })
            let _placements = [...placements]
            _placements.push({
                value: value,
                amount: selectedValue
            })
            setPlacements(_placements)
        }
    }

    function showPlacement(_placements) {
        let newPlacements = mergeAmounts(_placements)
        return newPlacements.map((_placement) => {
            return (
                <div className="placement">
                    <div className="value">
                        <label>Case : {_placement.value}</label>
                        <label>{_placement.amount} LNA</label>
                    </div>
                    <FontAwesomeIcon icon={faTrash} />
                </div>
            )
        })
    }

    function mergeAmounts(arr) {
        const result = [];
        const map = new Map();
        for (const obj of arr) {
            const value = obj.value;
            const amount = parseInt(obj.amount);
            if (!map.has(value)) {
                map.set(value, amount);
            } else {
                map.set(value, map.get(value) + amount);
            }
        }
        for (const [key, value] of map.entries()) {
            result.push({ value: key, amount: value.toString() });
        }
        return result;
    }

    return (
        loading ? (
            <div className="home">
                <Header
                    money={info.balance}
                />
                <div className="center">
                    <Roulette
                        handleChange={handleChangeRoulette}
                    />
                    {/* Jeton */}
                    <div className="jetons">
                        <Jeton
                            color="black"
                            value="1"
                            selectedValue={selectedValue === "1"}
                            onclick={handleClickJeton}
                        />
                        <Jeton
                            color="orange"
                            value="2"
                            selectedValue={selectedValue === "2"}
                            onclick={handleClickJeton}
                        />
                        <Jeton
                            color="red"
                            value="5"
                            selectedValue={selectedValue === "5"}
                            onclick={handleClickJeton}
                        />
                        <Jeton
                            color="blue"
                            value="10"
                            selectedValue={selectedValue === "10"}
                            onclick={handleClickJeton}
                        />
                        <Jeton
                            color="green"
                            value="20"
                            selectedValue={selectedValue === "20"}
                            onclick={handleClickJeton}
                        />
                    </div>
                    {/* Placement */}
                    {placements.length > 0 ? (
                        <div className="placements">
                            Placement :
                            {showPlacement(placements)}
                        </div>
                    ) : (null)}
                </div>
            </div>
        ) : (null)

    );
}

export default Home