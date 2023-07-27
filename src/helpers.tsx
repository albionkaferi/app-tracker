export const strokeColor = (percent: number) => {
    switch (true) {
      case percent <= 10:
        return { from: '#e24768', to: '#d7415e' };
      case percent <= 20:
        return { from: '#d7415e', to: '#cc3b54' };
      case percent <= 30:
        return { from: '#cc3b54', to: '#c0354a' };
      case percent <= 40:
        return { from: '#c0354a', to: '#b53041' };
      case percent <= 50:
        return { from: '#b53041', to: '#aa2a38' };
      case percent <= 60:
        return { from: '#aa2a38', to: '#9f252f' };
      case percent <= 70:
        return { from: '#9f252f', to: '#942027' };
      case percent <= 80:
        return { from: '#942027', to: '#891b1f' };
      case percent <= 90:
        return { from: '#891b1f', to: '#7e1518' };
      default:
        return { from: '#7e1518', to: '#731010' };
    }
};


export function processToObject(list: string[]) {
    return list.map((process) => {
        const total: string = (process[1][0] + process[1][1] < process[1][2]) ? process[1][0] + process[1][1] :  process[1][2];
        const allowed: string = process[1][2];
        return {
        key: process[0],
        name: process[0],
        total: total,
        allowed: allowed,
        progress: Math.trunc(Number(total) / Number(allowed) * 100),
        }
    })
}


