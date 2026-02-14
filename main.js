const inputs = document.querySelectorAll("input");
const btns = document.querySelectorAll(".reveal")
const ip = document.getElementById("ip");

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

class IPv4 {
    constructor() {
        this.ip = [rand(10, 239), rand(1, 254), rand(1, 254), rand(1, 254)];
        this.cidr = rand(8, 30);
    }
    get mask() {
        let bits = this.cidr;
        return Array.from({ length: 4 }, () => {
            const value = bits >= 8 ? 255 : bits <= 0 ? 0 : 256 - Math.pow(2, 8 - bits);
            bits -= 8;
            return value;
        });
    }
    get network() { return this.ip.map((o, i) => o & this.mask[i]); }
    get broadcast() { return this.ip.map((o, i) => o | (255 - this.mask[i])); }
    getString(type) {
        if (type === "mask") return this.mask.join(".");
        if (type === "network") return this.network.join(".");
        if (type === "broadcast") return this.broadcast.join(".");
        return "";
    }
    getData(type) {
        if (type === "mask") return this.mask;
        if (type === "network") return this.network;
        if (type === "broadcast") return this.broadcast;
        return [0, 0, 0, 0];
    }
    display() { ip.innerText = `${this.ip.join('.')}/${this.cidr}`; }
}

let currentIP = new IPv4();
currentIP.display();

inputs.forEach((input) => {
    input.value = "";
    input.addEventListener("input", (e) => update(e, input));
});
btns.forEach((btn) => { btn.addEventListener("click", (e) => reveal(btn)); });

function update(event, input) {
    const type = input.getAttribute("id");
    let value = input.value;
    value = value.replace(/[^0-9.]/g, "");
    const octets = value.split(".");

    if (octets.length > 0) {
        const index = octets.length - 1;
        let oct = octets[index];

        if (parseInt(oct) > 255) {
            oct = 255;
            octets[index] = oct;
            value = octets.join(".");
        }

        if (event.inputType != "deleteContentBackward" && octets.length < 4) {
            const dataArray = currentIP.getData(type);
            const data = dataArray[index];
            const isFull = oct.length === 3;
            const isMatch = parseInt(oct) === data;
            if (isFull || isMatch) value += ".";
        }
    }
    input.value = value;
    validate(input);
}

function reveal(button) {
    const target = button.dataset.target;
    const input = document.getElementById(target);
    if (input) {
        input.value = currentIP.getString(target);
        validate(input);
    }
}

function validate(input) {
    const type = input.getAttribute("id");
    const adr = currentIP.getString(type);
    input.classList.remove("right", "wrong");
    input.disabled = false;

    if (input.value === adr) {
        input.classList.add("right");
        input.disabled = true
    } else if (input.value.length > 0) {
        input.classList.add("wrong");
    }
}
