'reach 0.1';
const Persons = {
    follower_amt: UInt
}
export const main = Reach.App(() => {
    const House = Participant('House', {
        min_followers: UInt,
        whitlisted_address: Fun([Address], Null),
        nft: Token
    })

    const Person1 = Participant('Person1', {
        ...Persons
    })
    const Person2 = Participant('Person2', {
        ...Persons
    })
    init()
    House.only(() => {
        const min_follower = declassify(interact.min_followers)
        const nfts = declassify(interact.nft)
    })
    House.publish(min_follower, nfts)
    commit()
    Person1.only(() => {
        const p1 = declassify(interact.follower_amt)
    })
    Person1.publish(p1)
    commit()

    Person2.only(() => {
        const p2 = declassify(interact.follower_amt)
    })
    Person2.publish(p2)
    commit()

    House.pay([[1, nfts]])

    const [p1pay, p2pay, housepay] =
        p1 >= min_follower && p1 > p2 ? [1, 0, 0] :
            p2 >= min_follower && p2 > p1 ? [0, 1, 0] :
                [0, 0, 1]

    const whitelisted = new Set()

    const address = p1pay == 1 ? Person1 :
        p2pay == 1 ? Person2 :
            House
    whitelisted.insert(address)
    commit()

    House.only(() => {
        const address_whitelisted = declassify(interact.whitlisted_address(address))
    })
    House.publish(address_whitelisted)

    transfer([[p1pay, nfts]]).to(Person1)
    transfer([[p2pay, nfts]]).to(Person2)
    transfer([[housepay, nfts]]).to(House)
    commit()

});
