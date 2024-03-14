const { format } = require("date-fns")
const Filter = require("bad-words")
const FilterMessage = (rawMessage, userName) => {
    const filter = new Filter()
    filter.addWords("duma", "dit", "cac", "buoi", "loz", "địt", "cặc", "buồi", "lồn", "vcl")
    const message = !filter.isProfane(rawMessage) ? rawMessage : filter.clean(rawMessage)
    return {
        userName,
        message,
        createAt: format(new Date(), "dd/MM/yyyy - hh:mm:ss")
    }
}
module.exports = {
    FilterMessage
}