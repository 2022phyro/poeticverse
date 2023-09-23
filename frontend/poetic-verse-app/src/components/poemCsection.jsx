import { useState, useEffect } from "react";
import { PoemObject } from "./poem";
import { api } from "../utils";
import { useLocation } from "react-router-dom";

export function PoemSection() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const [data, setData] = useState({})

    useEffect(() => {
        api(true).get(`/poem?poem_id=${id}`)
        .then((res) => {
            console.log(res.data)
            setData(res.data)
        })
        .catch((err) => console.error(err))
    }, [id, setData])
    return (
        <PoemObject {...data}/>
    )
}
