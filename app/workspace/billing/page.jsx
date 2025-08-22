import React from 'react'
import {PricingTable} from "@clerk/nextjs";

function Billing() {
    return(
        <div>
            <h2 className={'font-bold text-3xl p-5'}>Select Plan</h2>
            <PricingTable />
        </div>
    )
}
export default Billing