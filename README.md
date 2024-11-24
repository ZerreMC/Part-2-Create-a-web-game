# Seven and a half

> Developed by:
> **Sebastian Gutierrez**, 
> **Joel Cano**

The goal of this project is to create a web-based implementation of the classic card game **Seven and a Half** using **JavaScript**, **HTML**, and **CSS**.

## Game Rules
The game is played using a **Spanish deck** (40 cards). It resembles Blackjack but has different rules for card values:  
- Cards **1 to 7** retain their numeric value.  
- **Face cards** (Jack, Queen, King) are worth **½ point each**.  

### Steps
1. The player starts putting him name and the initial money.
2. The player can request additional cards or stop any time.
3. If the player's score exceeds 7½, they loose immediately.
4. If the player decides to stop:
   - The dealer automatically plays and attempts to beat the player's score without exceeding 7½
   - A winner is determinated based on the final scores.

##Technologies Used
- **HTML, CSS, and JavaScript**: Core technologies for building the game's interface and logic.

## Implementation details
### Development process

1. We start by researching the rules of the game in reliable sources, such as [the Wikipedia page on Sette e Mezzo](https://en.wikipedia.org/wiki/Sette_e_mezzo).
2. After understanding the rules, we divided the tasks as follows:
   - **Joel Cano**: Focused on creating the basic functions of the game in JavaScript to ensure that the core logic of the game was functional.
   - **Sebastián Gutiérrez**: Worked on the design and implementation of the web interface, focusing on the accessibility and styling of the HTML and CSS files.
3. Once the initial structure was completed:
   - JavaScript functions were integrated into the HTML files.
   - Additional adjustments were made to improve the user experience and ensure smooth gameplay.

### Key decisions
- **Accessibility:** We ensured that the design was accessible to users by adhering to web standards.
- **Game Logic:** JavaScript was written in a modular way to facilitate updates and scalability.
- **Design Frameworks:** No frameworks were used to make it challenging to do everything in native.

## Extras
As extras aside from the main activity, to make it a bit better, we also added the capablity to play against bots.

## References
- [Sette e Mezzo - Wikipedia](https://en.wikipedia.org/wiki/Sette_e_mezzo)
- [Initial Design - Figma](https://www.figma.com/design/2cl7p9aAchbT7uJ2qKv2aP/Seven-and-a-Half-Game?node-id=0-1&t=OYZIZILJrdN1hvYR-1)
