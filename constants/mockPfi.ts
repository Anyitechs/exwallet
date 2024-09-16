type PFI = {
    name: string,
    did: string,
    offerings: {
        from: string,
        to: string
    }[],
    rating: number
}

export const MOCKPFI: PFI[] =  [
    {   
        name: "🏦 AquaFinance Capital",
        did: "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
        offerings: [
            {
                from: "GHS",
                to: "USDC"
            },
            {
                from: "NGN",
                to: "KES"
            },
            {
                from: "KES",
                to: "USD"
            },
            {
                from: "USD",
                to: "KES"
            }
        ],
        rating: 5
    },
    {   
        name: "🏦 Flowback Financial",
        did: "did:dht:zkp5gbsqgzn69b3y5dtt5nnpjtdq6sxyukpzo68npsf79bmtb9zy",
        offerings: [
            {
                from: "USD",
                to: "EUR"
            },
            {
                from: "EUR",
                to: "USD"
            },
            {
                from: "USD",
                to: "GBP"
            },
            {
                from: "USD",
                to: "BTC"
            }
        ],
        rating: 4.5
    },
    {   
        name: "🏦 Vertex Liquid Assets",
        did: "did:dht:enwguxo8uzqexq14xupe4o9ymxw3nzeb9uug5ijkj9rhfbf1oy5y",
        offerings: [
            {
                from: "EUR",
                to: "USD"
            },
            {
                from: "EUR",
                to: "USDC"
            },
            {
                from: "USD",
                to: "EUR"
            },
            {
                from: "EUR",
                to: "GB"
            }
        ],
        rating: 4
    },
    {   
        name: "🏦 Titanium Trust",
        did: "did:dht:ozn5c51ruo7z63u1h748ug7rw5p1mq3853ytrd5gatu9a8mm8f1o",
        offerings: [
            {
                from: "USD",
                to: "AUD"
            },
            {
                from: "USD",
                to: "GBP"
            },
            {
                from: "USD",
                to: "KES"
            },
            {
                from: "USD",
                to: "MXN"
            }
        ],
        rating: 4
    }
]