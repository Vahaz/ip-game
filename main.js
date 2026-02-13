const inputs = document.querySelectorAll('.input');
const displayIP = document.getElementById("ip");
const displayCIDR = document.getElementById("cidr");

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

class IPv4 {
    constructor(ip, cidr) {
        this.ip = ip != null ? ip : [rand(10, 239), rand(1, 254), rand(1, 254), rand(1, 254)];
        this.cidr = cidr != null ? cidr : rand(8, 30);
    }

    get mask() {
        let bits = this.cidr;
        return Array.from({ length: 4 }, () => {
            const value = bits >= 8 ? 255 : bits <= 0 ? 0 : 256 - 2 ** (8 - bits);
            bits -= 8;
            return value;
        });
    }

    get network() {
        return this.ip.map((o, i) => o & this.mask[i]);
    }

    get broadcast() {
        return this.ip.map((o, i) => o | (255 - this.mask[i]));
    }

    toBinary(adr) {
        return adr.map(o => ("00000000" + o.toString(2)).slice(-8));
    }

    display() {
        displayIP.innerText = this.ip.join('.');
        displayCIDR.innerText = `/${this.cidr}`;
    }
}

function reset() {
    ipv4 = new IPv4();
    ipv4.display();
    inputs.forEach((input) => {
        input.value = '';
        input.readOnly = false;
        input.classList.remove("wrong");
        input.classList.remove("right");
    })
}

function empty() {
    inputs.forEach((input) => {
        input.value = '';
        input.readOnly = false;
        input.classList.remove("wrong");
        input.classList.remove("right");
    })
}

let ipv4 = new IPv4();
ipv4.display();

inputs.forEach((input, i) => {
    input.addEventListener("input", () => update(input, i));
})

function update(input, index) {
    switch (true) {
        case (index <= 3):
            if (ipv4.mask[index] == input.value) {
                input.classList.remove("wrong");
                input.classList.add("right");
                nextInput(index);
                input.readOnly = true;
            } else {
                input.classList.remove("right");
                input.classList.add("wrong");
            }
            break;
        case (index > 3 && index <= 7):
            if (ipv4.toBinary(ipv4.mask)[index-4] == input.value) {
                input.classList.remove("wrong");
                input.classList.add("right");
                nextInput(index);
                input.readOnly = true;
            } else {
                input.classList.remove("right");
                input.classList.add("wrong");
            }
            break;
        case (index > 7 && index <= 11):
            if (ipv4.network[index-8] == input.value) {
                input.classList.remove("wrong");
                input.classList.add("right");
                nextInput(index);
                input.readOnly = true;
            } else {
                input.classList.remove("right");
                input.classList.add("wrong");
            }
            break;
        case (index > 11 && index <= 15):
            if (ipv4.toBinary(ipv4.network)[index-12] == input.value) {
                input.classList.remove("wrong");
                input.classList.add("right");
                nextInput(index);
                input.readOnly = true;
            } else {
                input.classList.remove("right");
                input.classList.add("wrong");
            }
            break;
        case (index > 15 && index <= 19):
            if (ipv4.broadcast[index-16] == input.value) {
                input.classList.remove("wrong");
                input.classList.add("right");
                nextInput(index);
                input.readOnly = true;
            } else {
                input.classList.remove("right");
                input.classList.add("wrong");
            }
            break;
        case (index > 19 && index <= 23):
            if (ipv4.toBinary(ipv4.broadcast)[index-20] == input.value) {
                input.classList.remove("wrong");
                input.classList.add("right");
                nextInput(index);
                input.readOnly = true;
            } else {
                input.classList.remove("right");
                input.classList.add("wrong");
            }
            break;
        default:
            input.classList.remove("right");
            input.classList.add("wrong");
            break;
    }

    if (input.value.length >= input.max) {
        input.value = input.value.slice(0, input.max);
    }
}

function nextInput(index) {
    if (index + 1 == 24) {
        inputs[index].blur();
    } else {
        inputs[index + 1].focus();
    }
}

function reveal(index) {
    for (let i = 0; i < 4; i++) {
        let input = inputs[index+i];
        let idx = index+i
        switch (true) {
            case (idx <= 3):
                input.value = ipv4.mask[i]
                input.classList.remove("wrong");
                input.classList.add("right");
                input.readOnly = true;
                break;
            case (idx > 3 && idx <= 7):
                input.value = ipv4.toBinary(ipv4.mask)[i]
                input.classList.remove("wrong");
                input.classList.add("right");
                input.readOnly = true;
                break;
            case (idx > 7 && idx <= 11):
                input.value = ipv4.network[i]
                input.classList.remove("wrong");
                input.classList.add("right");
                input.readOnly = true;
                break;
            case (idx > 11 && idx <= 15):
                input.value = ipv4.toBinary(ipv4.network)[i]
                input.classList.remove("wrong");
                input.classList.add("right");
                input.readOnly = true;
                break;
            case (idx > 15 && idx <= 19):
                input.value = ipv4.broadcast[i]
                input.classList.remove("wrong");
                input.classList.add("right");
                input.readOnly = true;
                break;
            case (idx > 19 && idx <= 23):
                input.value = ipv4.toBinary(ipv4.broadcast)[i]
                input.classList.remove("wrong");
                input.classList.add("right");
                input.readOnly = true;
                break;
            default:
                break;
        }
    }
}
