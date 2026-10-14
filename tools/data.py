# Elective (Section C) questions, DSE Economics Paper 2, transcribed from the papers and marking schemes.
# Block kinds: ('p', text) paragraph, ('img', file, width_in), ('table', rows), ('box', [lines]).
# Each part: label, sub-topic code, marks, question blocks, marking-scheme lines.
# Sub-topic codes: E1.1 monopoly pricing, E1.2 price discrimination, E1.3 anti-competitive behaviour,
#                  E2.1 comparative advantage & gains from trade, E2.2 economic growth & development.

SUBTOPICS = {
    'E1': ('Elective 1: Monopoly Pricing and Antitrust Law', [
        ('E1.1', '1. Monopoly Pricing and Efficiency'),
        ('E1.2', '2. Price Discrimination'),
        ('E1.3', '3. Anti-competitive Behaviour and Competition Policy'),
    ]),
    'E2': ('Elective 2: Extension of Trade Theory, Economic Growth and Development', [
        ('E2.1', '1. Comparative Advantage and Gains from Trade'),
        ('E2.2', '2. Economic Growth and Development'),
    ]),
}

QUESTIONS = []


def Q(year, num, elective, stem, parts):
    QUESTIONS.append(dict(year=year, q=num, elective=elective, stem=stem, parts=parts))


def part(label, topic, marks, blocks, ms, pre=()):
    """pre = context paragraphs printed between parts in the paper (repeated if the part is split off)."""
    return dict(label=label, topic=topic, marks=marks, blocks=list(blocks), ms=list(ms), pre=list(pre))


# ------------------------------------------------------------------ 2012
Q(2012, 14, 'E1', [('p', 'Large supermarket chains around the world are alleged to practise price discrimination.')], [
    part('(a)', 'E1.2', 2, [('p', '(a) What is price discrimination? (2 marks)')], [
        '(a) Price discrimination is a kind of pricing behaviour by which different prices are charged on different customers for the same goods for reasons unrelated to difference in costs. (2)']),
    part('(b)', 'E1.2', 2, [('p', '(b) State TWO conditions for price discrimination. (2 marks)')], [
        '(b)',
        '- The seller needs to be a price searcher.',
        '- The markets are separable. / Resale of goods and services between markets is difficult or very costly.',
        '- Customers in different markets have different elasticities of demand.',
        '- Customers in different markets have different information costs.',
        '- any other relevant point',
        '[@1; max: 2. Mark the FIRST TWO points only.]']),
    part('(c)', 'E1.2', 6, [
        ('p', '(c) Below are some pricing arrangements among large supermarket chains. Explain whether they constitute price discrimination.'),
        ('p', '(i) Customers pay less for the same products during a promotional period.'),
        ('p', '(ii) Customers with discount coupons pay less for the same products. (6 marks)')], [
        '(c) (i) No, because (1)',
        '- the practice of lowering the price of the same item during a promotional period applies to all customers. (2)',
        'OR',
        '- the sellers make no attempt to separate customers. / the market is not separated. (2)',
        '[max: 2]',
        '(ii) Yes, because (1)',
        '- the costs of serving customers with or without discount coupons are the same. (2)',
        'OR',
        '- customers with discount coupons are the ones who are more sensitive to price changes and hence higher price elasticity. Therefore, they are charged a lower price. (2)',
        '[max: 2]']),
    part('(d)', 'E1.3', 4, [
        ('p', '(d) Some supermarket chains are involved in the following business practices.'),
        ('p', '(1) They agree to raise the prices of the same products simultaneously.'),
        ('p', '(2) They request suppliers not to supply the same products to other sellers.'),
        ('p', 'What kind of anti-competitive business practice is described in each of the above practices? State whether each of the above practices constitutes horizontal agreement or vertical agreement. (4 marks)')], [
        '(d) (1) Price fixing: horizontal agreement (1+1)',
        '(2) Exclusive dealing: vertical agreement (1+1)']),
    part('(e)', 'E1.3', 2, [('p', '(e) State TWO ways in which anti-competitive business practices may harm consumers. (2 marks)')], [
        '(e)',
        '- higher price',
        '- lower output',
        '- lack of choices to consumers',
        '- loss in consumer surplus',
        '- market competition restricted',
        '- any other relevant point',
        '[@1; max: 2. Mark the FIRST TWO points only.]']),
])

Q(2012, 15, 'E2', [
    ('p', 'In the diagram below, AA and BB are the production-possibility frontiers of Country A and Country B respectively.'),
    ('img', 'e2012_15.png', 3.4)], [
    part('(a)', 'E2.1', 4, [
        ('p', '(a) (i) Which country has a comparative advantage in producing Good X? Explain.'),
        ('p', '(ii) Is mutually beneficial trade possible between these two countries? Explain. (4 marks)')], [
        '(a) (i) In country A, the opportunity cost of producing 1X = 1Y while in country B, the opportunity cost of producing 1X = 0.667Y. (1)',
        'Country B has a lower opportunity cost in producing good X, therefore Country B has a comparative advantage in producing good X. (1)',
        '(ii) Yes, because (1)',
        'their costs of producing goods X and Y are different. (1)']),
    part('(b)', 'E2.1', 4, [('p', '(b) If the terms of trade is 10 units of X in exchange for 8 units of Y, what will be the gain from trade per unit of X traded for each country? (4 marks)')], [
        '(b) Country A will gain (1Y – 0.8Y =) 0.2Y (2)',
        'and Country B will gain (0.8Y – 0.667Y =) 0.133Y per unit of X traded respectively. (2)']),
    part('(c)', 'E2.1', 4, [
        ('p', '(c) Explain whether your answer in (a)(i) would change in the following situations:'),
        ('p', '(i) Country B finds new resources that raise the output of both Good X and Good Y by the same proportion.'),
        ('p', '(ii) Country B discovers a new technology that improves the production method of Good Y. (4 marks)')], [
        "(c) (i) No, because (1)",
        "country B will still enjoy a CA in producing good X as country A's and B's opportunity cost of production does not change. (1)",
        '(ii) Uncertain, because (1)',
        'country B may no longer enjoy a CA in producing good X if the maximum possible level of production of Y exceeds 30 units. (1)']),
    part('(d)', 'E2.2', 4, [
        ('p', '(d) The Human Development Index (HDI) of Country B increases after trade.'),
        ('p', '(i) What does HDI measure?'),
        ('p', '(ii) Suggest ONE possible reason for such an increase. (4 marks)')], [
        '(d) (i) HDI measures the level of economic and social development of a country in 3 dimensions: health (measured by life expectancy at birth), education (measured by mean years of schooling and expected years of schooling) and living standard (measured by Gross National Income per capita). (2)',
        '(ii)',
        '- More production, business activities and employment opportunities in the import/export industry lead to higher per capita GDP.',
        '- Foreign health product or technology imported lead to better health.',
        '- any other relevant point',
        '[@2; max: 2. Mark the FIRST ONE point only.]']),
])

# marking-scheme diagrams: name -> (year, MS page, x0, y0, x1, y1 in pt)
MSFIGS = {
    'ms2013_13a': (2013, 10, 140, 222, 398, 424),
    'ms2013_14a': (2013, 11, 140, 166, 445, 350),
    'ms2013_14b': (2013, 11, 140, 490, 445, 678),
}

# ------------------------------------------------------------------ 2013
Q(2013, 13, 'E1', [], [
    part('(a)', 'E1.1', 7, [
        ('p', '(a) Figure 2 shows the demand curve faced by a monopolist. The monopolist has a constant average cost of production. With the aid of Figure 2, explain why simple monopoly pricing may lead to economic inefficiency. (7 marks)'),
        ('img', 'e2013_13.png', 3.6)], [
        '(a) Verbal elaboration:',
        'The monopolist has a constant marginal cost of production. It will produce at the output level where marginal revenue equals marginal cost in order to maximize profit. At this output level, marginal benefit is greater than marginal cost and there is a deadweight loss. (3)',
        'Indicate on the diagram:',
        '- Correct position of marginal revenue (1)',
        '- Constant marginal cost (1)',
        '- Correct position of P and Q (1)',
        '- Correct position of Deadweight Loss (1)',
        ('img', 'ms2013_13a.png', 3.0)]),
    part('(b)', 'E1.2', 3, [('p', '(b) A retailer offers discounts to tourists who are able to present their travel documents at the cashier. Does this practice constitute price discrimination? Explain. (3 marks)')], [
        '(b) Yes. This is because the seller is selling the same product produced at the same cost to different people (tourists and locals) at different prices. (3)']),
    part('(c)', 'E1.3', 4, [
        ('p', '(c) Name the anti-competitive behaviour that each of the following cases may constitute and explain how such behaviour restrains competition. (4 marks)'),
        ('p', '(i) An instant noodle supplier does not supply its product to a local retailer because the retailer refuses to comply with the recommended price set by the supplier.'),
        ('p', '(ii) One of the major bus companies reduces its fares to a level below its cost of production.')], [
        '(c) (i) Resale price maintenance. This reduces price competition among retailers. (2)',
        '(ii) Predatory pricing. This aims to drive out competitors. (2)']),
    part('(d)', 'E1.3', 2, [('p', '(d) Explain ONE concern when introducing a competition policy. (2 marks)')], [
        '(d)',
        '- Administrative costs may be high',
        '- Higher cost of production',
        '- Other measures can be used to promote competition',
        '- Market is competitive and government intervention is not necessary',
        '- any other relevant point',
        '[@2; max: 2]']),
])

Q(2013, 14, 'E2', [], [
    part('(a)', 'E2.1', 10, [
        ('p', '(a) Country A requires 1 unit of labour to produce a unit of Good X and 2.5 units of labour to produce a unit of Good Y. Suppose labour is the only resource required for production. Country A is endowed with 10 units of labour and the terms of trade is 1X = 1Y.'),
        ('p', '(i) Explain which good Country A will import.'),
        ('p', '(ii) Construct the production possibilities frontier and consumption possibilities frontier of Country A in Figure 3. (4 marks)'),
        ('p', 'Suppose the labour force of Country A increases by 10 units.'),
        ('p', '(iii) Will the direction of trade be affected? Will Country A be better off as a result? Explain your answers with the aid of Figure 3. (6 marks)'),
        ('img', 'e2013_14.png', 3.8)], [
        '(a) (i) Country A will import Good Y because the domestic production cost of Good Y is higher than the terms of trade. (2)',
        '(ii) Indicate on the diagram:',
        'Correct position of PPF (1)',
        'Correct position of CPF (1)',
        ('img', 'ms2013_14a.png', 3.0),
        '(iii) Country A will still import Good Y because the domestic production cost of Good Y is still higher than the terms of trade. Country A will be better off as the CPF shifts outward / Country A can consume more of Good X and Good Y. (4)',
        'Indicate on the diagram:',
        'Correct position of PPF (1)',
        'Correct position of CPF (1)',
        ('img', 'ms2013_14b.png', 3.0)]),
    part('(b)', 'E2.2', 6, [
        ('p', '(b) Refer to the following information about Hong Kong and Japan in 2011 and answer the following questions.'),
        ('table', [['', 'Human Development Index (HDI) rank', 'Gross National Income per capita rank MINUS HDI rank'],
                   ['Japan', '12', '11'], ['Hong Kong', '13', '-4']]),
        ('p', '(i) Which place had a higher Gross National Income per capita in 2011? Show your workings.'),
        ('p', "(ii) State TWO possible reasons why Japan had a higher HDI rank than Hong Kong in 2011."),
        ('p', "(iii) Suggest ONE government policy that could raise Hong Kong's HDI rank. (6 marks)")], [
        '(b) (i) Hong Kong. (2)',
        'Hong Kong: GNI per capita rank – HDI rank = –4; given HDI rank = 13, GNI per capita rank = 9.',
        'Japan: GNI per capita rank – HDI rank = 11; given HDI rank = 12, GNI per capita rank = 23.',
        '(ii)',
        '- Japanese have longer years of schooling on average.',
        '- Japanese have a longer life expectancy on average. (2)',
        '[Mark the FIRST TWO points only.]',
        '(iii) Any example of policy that can enhance the education level or health condition of Hong Kong people. E.g., increase government subsidy on tertiary education. (2)']),
])

MSFIGS.update({
    'ms2014_13': (2014, 11, 105, 145, 385, 380),
    'ms2014_14': (2014, 12, 110, 302, 550, 662),
    'ms2015_13': (2015, 12, 118, 186, 372, 402),
})

# ------------------------------------------------------------------ 2014
Q(2014, 13, 'E1', [('p', 'Ng Fung Hong (五豐行) is the only agent endorsed by the Ministry of Commerce (商務部) to export live cattle to Hong Kong from the mainland.')], [
    part('(a)', 'E1.1', 3, [
        ('p', '(a) With the aid of Figure 3, explain how the profit maximizing output and price of live cattle sold by Ng Fung Hong are determined. Indicate the output and price as Qm and Pm respectively. (3 marks)'),
        ('img', 'e2014_13.png', 3.6)], [
        '(a) Verbal elaboration: The profit-maximizing output for a monopolist is determined by the equality between its marginal cost and marginal revenue. (1)',
        'Indicate on the diagram:',
        '- Correct marginal revenue curve (1)',
        '- Correct Qm and Pm (1)',
        ('img', 'ms2014_13.png', 3.0)]),
    part('(b)', 'E1.1', 4, [('p', '(b) Suppose the market of exporting live cattle from the mainland is opened for competition and it becomes perfectly competitive. Assume the marginal cost curve remains unchanged, explain the effects of such a change in the market structure on the output and price with the aid of Figure 3. Indicate the new output and price as Qc and Pc respectively. (4 marks)')], [
        '(b) Verbal elaboration: Under perfect competition, output is determined by the equality between marginal cost and marginal willingness-to-pay. (1)',
        'The opening of the market will result in a drop in price (1)',
        'and a rise in quantity. (1)',
        'Indicate on the diagram:',
        '- Correct Qc and Pc (1)']),
    part('(c)', 'E1.2', 3, [('p', '(c) Does the practice in the above advertisement constitute price discrimination? Explain. (3 marks)')], [
        '(c) No, as all consumers are entitled to the same discounts (pricing practice) and there is no market segmentation. (3)',
        'OR',
        'Yes, as consumers buying different quantities ("pounds") of beef would end up paying different "average prices" (price per pound) for the same beef produced at the same cost. (3)',
        '[Either one, max: 3]'],
        pre=[('p', 'Study the following advertisement of a supermarket.'),
             ('box', ['Big Sale for Fresh Beef', 'More Purchase, Greater Discount!!', 'The 2nd pound further 10% off', 'The 3rd pound further 20% off'])]),
    part('(d)', 'E1.3', 4, [
        ('p', '(d) Name the anti-competitive behaviour that each of the following cases may constitute and explain how such behaviour restrains competition.'),
        ('p', '(i) Suppose Ng Fung Hong agrees to supply the fresh beef solely to one supermarket chain on condition that the chain does not sell imported frozen beef.'),
        ('p', '(ii) Several dominant supermarket chains agree to offer discounts for fresh beef simultaneously. (4 marks)')], [
        '(d) (i) Exclusive dealing. It forecloses third-party access to its distribution network. (2)',
        '(ii) Price fixing. Through such collusive action, they can drive the small retailers out of the market. (2)']),
    part('(e)', 'E1.3', 2, [('p', '(e) Regarding the live cattle market, give ONE justification for introducing the competition policy. (2 marks)')], [
        '(e)',
        '- Introducing more sellers may improve efficiency via competition',
        '- Consumers can enjoy lower price and higher quantity and quality of live cattle products',
        '- any other relevant point',
        '[@2; max: 2. Mark the FIRST point only.]']),
])

Q(2014, 14, 'E2', [
    ('p', 'Figure 4 shows the production possibility frontiers (PPF) of Country A and Country B.'),
    ('img', 'e2014_14.png', 3.6),
    ('p', 'Suppose the amount of resources of Country A doubles that of Country B in the production of Good X and Good Y. Both countries allocate their resources evenly in the production of Good X and Good Y.')], [
    part('(a)', 'E2.1', 2, [('p', '(a) Explain why the production possibility frontiers of Country A and Country B are straight lines. (2 marks)')], [
        '(a) The marginal (and average) costs of production for Good X and Good Y are constant (and do not increase with the quantities of X or Y). So the opportunity cost of X in terms of Y, which is the slope of the PPF, is constant. (2)']),
    part('(b)', 'E2.1', 5, [
        ('p', '(b) Explain whether Country A enjoys'),
        ('p', '(i) an absolute advantage in producing Good X.'),
        ('p', '(ii) a comparative advantage in producing Good X. (5 marks)')], [
        '(b) (i) Country B can produce 8 units of Good X by using all of its resources. Given the amount of resources owned by Country A doubles that of Country B, Country A can only produce 5 (= 10/2) units of X by using the same amount of resources as B. So Country A does not have absolute advantage in producing X. (3)',
        '(ii) In Country A, the opportunity cost of producing one unit of X is (10/10) = 1Y. In Country B, the opportunity cost of producing one unit of X is (16/8) = 2Y. So Country A has comparative advantage in producing Good X. (2)']),
    part('(c)', 'E2.1', 5, [
        ('p', '(c) Suppose the international price of a unit of Good X is 1.5 units of Good Y. Show on Figure 4:'),
        ('p', '(i) The production point of Country A after specialization.'),
        ('p', '(ii) The consumption possibility frontier (CPF) of Country A when there is trade.'),
        ('p', '(iii) The consumption point of Country A if 4 units of Good X are traded. (5 marks)')], [
        '(c) Indicate on the diagram:',
        '(i) production point of Country A: (10, 0) (1)',
        '(ii) CPF of Country A: a straight line with X-intercept equals 10 and Y-intercept equals 15 (2)',
        '(iii) consumption point of Country A: (6, 6) (2)',
        ('img', 'ms2014_14.png', 3.4)]),
    part('(d)', 'E2.2', 4, [('p', '(d) The production possibility frontier of Country A has shifted out due to changes in government policies on human capital. Suggest TWO such possible policy changes in Country A. (4 marks)')], [
        '(d) Policies:',
        '- tax allowance for further education (or education subsidy)',
        '- teaching grants – to universities for more degree programmes',
        '- bigger immigration quota for experts and professionals',
        '- any other relevant point',
        '[@2; max: 4. Mark the FIRST TWO points only.]']),
])

MSFIGS.update({
    'ms2015_14': (2015, 14, 112, 272, 445, 545),
    'ms2016_14': (2016, 13, 78, 396, 540, 705),
    'ms2016_15': (2016, 15, 20, 218, 540, 575),
})

# ------------------------------------------------------------------ 2015
Q(2015, 13, 'E1', [('p', 'Super Power is the only licensed power supplier in City X. It adopts uniform pricing to maximise its profit.')], [
    part('(a)', 'E1.1', 3, [
        ('p', '(a) Indicate the quantity that it would produce as Q1 and the corresponding price as P1 in Figure 3. Briefly explain your answer. (3 marks)'),
        ('img', 'e2015_13.png', 3.6)], [
        '(a) Verbal elaboration: Super Power will produce at the output level where Marginal Revenue = Marginal Cost. (1)',
        'Indicate on the diagram:',
        '- Correct position of Q1 (1)',
        '- Correct position of P1 (1)',
        ('img', 'ms2015_13.png', 2.8)]),
    part('(b)', 'E1.1', 2, [('p', '(b) Explain, with the aid of Figure 3, why it is inefficient to adopt uniform pricing. (2 marks)')], [
        '(b) Verbal elaboration: At Q1, marginal benefit exceeds marginal cost. (1)',
        'Indicate on the diagram:',
        '- Correct position of deadweight loss (1)']),
    part('(c)', 'E1.1', 4, [
        ('p', '(c) The government imposes a lump sum tax, which is a fixed amount regardless of the quantity produced, on Super Power.'),
        ("p", "(i) Explain whether Super Power's marginal cost will increase because of the lump sum tax. (2 marks)"),
        ('p', '(ii) Indicate the after-tax output and price of Super Power as Q2 and P2 respectively in Figure 3. (2 marks)')], [
        '(c) (i) No. Since the lump sum tax is a fixed cost, which does not vary as output changes, it would not affect marginal cost. (2)',
        '(ii) Indicate on the diagram:',
        '- Correct position of Q2 (1)',
        '- Correct position of P2 (1)']),
    part('(d)', 'E1.2', 3, [('p', '(d) Super Power charges the domestic users $1.2 per unit of power consumed and the industrial users $0.9 per unit of power consumed. Does this pricing arrangement constitute price discrimination? Explain. (3 marks)')], [
        '(d) Yes. Different groups of customers (domestic users and industrial users) are charged different prices for the same good (power used) produced at the same cost (assuming that the same technology is used to supply power for both domestic and industrial uses). (3)']),
    part('(e)', 'E1.3', 2, [('p', '(e) Super Power has taken over the major coal supplier, which provides 90% of raw materials for the production of electricity in City X. Name the anti-competitive behaviour that Super Power may constitute and explain how such behaviour restrains competition. (2 marks)')], [
        '(e) Merger. (1)',
        'It restricts the entry of potential competitors. (1)']),
    part('(f)', 'E1.3', 2, [('p', '(f) The owners of Super Power claim the takeover in (e) is not anti-competitive. Justify their claim with ONE reason. (2 marks)')], [
        '(f) The merger may reduce the average cost of production by lowering the cost of raw materials / enjoying economies of scale. If Super Power transfers such benefits to the consumers via a reduction in the price of electricity, the merger may not be anti-competitive. (2)'],
        pre=[('p', 'Super Power has taken over the major coal supplier, which provides 90% of raw materials for the production of electricity in City X.')]),
])

Q(2015, 14, 'E2', [
    ('p', "In Figure 4, PPF is a country's production possibility frontier where E is the production point without trade. At point E, the domestic cost of production of one unit of good X is 2.5 units of good Y."),
    ('img', 'e2015_14.png', 3.0)], [
    part('(a)', 'E2.1', 2, [('p', '(a) Explain whether the country would produce at point N. (2 marks)')], [
        '(a) No, (1)',
        'because there will be idle resources in the country / the country is not maximizing its production. (1)',
        '[Note: the country may produce at point N if there exists unemployment due to, say, market frictions or structural changes.]']),
    part('(b)', 'E2.1', 3, [('p', '(b) The slope of dotted line AB is the world price of good X. Explain whether the country has a comparative advantage in producing good X. (3 marks)')], [
        '(b) No (1)',
        'because, without trade, the domestic cost of good X in the country (= 2.5Y) exceeds the world price of X (= 1Y). (2)',
        'OR',
        'Opportunity cost of 1X = slope of the tangent of PPF at E > slope of AB. (2)']),
    part('(c)', 'E2.1', 3, [('p', '(c) Suppose the country engages in international trade. Indicate its production point after trade and its consumption possibility frontier in Figure 4. (3 marks)')], [
        '(c) Indicate on the diagram:',
        ('img', 'ms2015_14.png', 3.0),
        '- correct position of production point after trade (1)',
        '- tangency between CPF and PPF (1)',
        '- CPF is parallel to AB (1)']),
    part('(d)', 'E2.1', 3, [('p', '(d) With the aid of Figure 4, explain whether the country will gain from trade. (3 marks)')], [
        '(d) Verbal elaboration: Yes, because the country can consume beyond its PPF (which is also its CPF without trade) / the country can consume more of X and Y after trade. (2)',
        'Indicate on the diagram:',
        '- Correct position of consumption point after trade (1)']),
    part('(e)', 'E2.2', 5, [
        ("p", "(e) After the country's opening up for trade, its Human Development Index (HDI) has risen."),
        ('p', '(i) Give ONE reason why international trade can lead to a rise in HDI. (1 mark)'),
        ('p', '(ii) Despite the rise in HDI, the residents in the country generally agree that the living standard has declined. Suggest TWO possible reasons to explain their view. (4 marks)')], [
        '(e) (i) Reason:',
        '- GDP may increase because of trade-induced transfer of superior technology from its trading partners, resulting in an increase in productivity.',
        '- Exchange in health technology may increase life expectancy.',
        '- any other relevant point',
        '[@1; max: 1. Mark the FIRST point only.]',
        '(ii) Reasons:',
        '- Workers in import-substitute industries may suffer unemployment',
        '- Income distribution may become more uneven',
        '- Pollution may increase (due to specialization in producing more "polluted" goods)',
        '- any other relevant point',
        '[@2; max: 4. Mark the FIRST TWO points only.]']),
])

# ------------------------------------------------------------------ 2016
Q(2016, 14, 'E1', [('p', 'Cheung Chau, an outlying island of Hong Kong, is accessible only by ferry. There is only one franchised ferry company providing public transport service between Central and Cheung Chau.')], [
    part('(a)', 'E1.1', 4, [
        ('p', '(a) Suppose the ferry company adopts simple monopoly pricing.'),
        ('p', '(i) Indicate the output and price as Qm and Pm respectively in Figure 2. (2 marks)'),
        ('p', '(ii) With the aid of Figure 2, explain why such a pricing arrangement would lead to a deadweight loss. (2 marks)'),
        ('img', 'e2016_14.png', 3.6)], [
        '(a) (i) - Correct position of Qm (1)',
        '- Correct position of Pm (1)',
        '(ii) Illustrated in the diagram: correct position of DL0 (1)',
        'Verbal elaboration: At Qm, marginal benefit (MB) is higher than marginal cost (MC). (1)']),
    part('(b)', 'E1.1', 4, [
        ('p', '(b) The fuel price has dropped in recent years.'),
        ("p", "(i) How would the reduction of fuel price affect the company's marginal cost? (1 mark)"),
        ('p', '(ii) Suppose the ferry company produces the SAME quantity and charges the SAME price after the fall in fuel price. Explain whether economic efficiency would be affected. Illustrate your answer in Figure 2. (3 marks)')], [
        '(b) (i) The reduction in fuel cost reduces the marginal cost. (1)',
        '(ii) Verbal elaboration: Economic efficiency would be lowered and the deadweight loss would be larger, as the gap between MB and MC would be enlarged and output would now be even further away from its efficient level. (2)',
        'Illustrated in the diagram: correct position of new DL / increase in DL / the increased gap between MB and MC (1)',
        ('img', 'ms2016_14.png', 3.4)]),
    part('(c)', 'E1.2', 3, [
        ('p', '(c) The table below shows the fare of ferry service from Central to Cheung Chau.'),
        ('table', [['Adult fare', '$13.20'], ['Child fare', '$6.60']]),
        ('p', 'Explain whether the above arrangement constitutes price discrimination. (3 marks)')], [
        '(c) Yes. As two groups of consumers (adults and children) are charged different prices for the same good (ferry service) produced at the same cost. (3)']),
    part('(d)', 'E1.3', 5, [
        ('p', '(d) Many restaurants in Cheung Chau serve seafood dishes. Some of them raise the prices by about 15% on public holidays simultaneously. A student commented, "The restaurants engage in anti-competitive behaviour. They violate a conduct rule under the Competition Ordinance!" His Economics teacher replied, "There may be an alternative explanation for the rise in prices."'),
        ("p", "(i) Explain under what situation the student's comment may be correct. (3 marks)"),
        ("p", "(ii) Give ONE reason to support the teacher's reply. (2 marks)")], [
        '(d) (i) If owners of the seafood restaurants agree to engage in price fixing and raise the price together (i.e. collusion), they would violate the first conduct rule under the Competition Ordinance. (3)',
        '(ii) The price increase may be a market response to increased demand for seafood meals during public holidays due to a bigger number of visitors. (2)',
        'OR',
        'The price increase may be a result of reduced supply of seafood meals due to higher production costs (e.g. need to hire more part-time workers) on public holidays. (2)']),
])

Q(2016, 15, 'E2', [
    ('p', 'In Figure 3, MN and TU are the production possibility frontiers of Country A and Country B respectively.'),
    ('img', 'e2016_15.png', 3.8)], [
    part('(a)', 'E2.1', 1, [('p', '(a) Explain why the production possibility frontier of Country A is concave to the origin. (1 mark)')], [
        '(a) The marginal costs of producing both X and Y are increasing in Country A. (1)']),
    part('(b)', 'E2.1', 3, [('p', '(b) With reference to the domestic cost of production in both countries, explain in which good Country A has a comparative advantage. (3 marks)')], [
        "(b) Country A's opportunity cost of producing 1X = 4Y (1)",
        "Country B's opportunity cost of producing 1X = 6.25Y (1)",
        'Country A has a lower cost in producing X, and thus it has a comparative advantage in producing X. (1)'],
        pre=[('p', 'The production point of Country A without trade is EA, at which the domestic cost of production of 1 unit of Good X is 4 units of Good Y.')]),
    part('(c)', 'E2.1', 4, [
        ('p', '(c) Indicate in Figure 3:'),
        ('p', '(i) the production point of Country A after trade as PA,'),
        ('p', '(ii) the consumption point of Country A as CA given that Country A consumes the SAME amount of Good X after trade, and'),
        ('p', '(iii) the volume of import and the volume of export of Country A. (4 marks)')], [
        '(c) Indicate in the diagram:',
        '(i) The correct position of PA (1)',
        '(ii) The correct position of CA (1)',
        '(iii) The correct volume of export (1)',
        'The correct volume of import (1)',
        ('img', 'ms2016_15.png', 3.6)],
        pre=[('p', 'The production point of Country A without trade is EA, at which the domestic cost of production of 1 unit of Good X is 4 units of Good Y.'),
             ('p', 'Suppose the slope of the dotted line is the world price of Good X.')]),
    part('(d)', 'E2.1', 2, [('p', '(d) Country B has a technological improvement which helps double its productivity on Good X and Good Y. Explain whether the answer in part (b) will change. (2 marks)')], [
        '(d) No, because the opportunity cost of producing X (and Y) will be unaffected by this technological change. (2)']),
    part('(e)', 'E2.2', 6, [
        ('p', '(e) The census statistics report of Country A warns that the country would suffer from brain drain, i.e. many residents with a high education level migrate to other countries.'),
        ('p', '(i) Explain TWO effects of brain drain on the economic growth of Country A. (4 marks)'),
        ('p', '(ii) In the light of globalisation, suggest ONE policy the government of Country A could adopt to relieve the problem. Briefly explain your answer. (2 marks)')], [
        '(e) (i) Effects on economic growth:',
        '- Lower per-capita GDP',
        '- Lower human capital / labour productivity',
        '- Lower marginal productivity of capital (due to complementarity of labour and capital)',
        '- Slower research and development',
        '- any other relevant point',
        '[@2; max: 4. Mark the FIRST TWO points only.]',
        '(ii) Policy:',
        '- Importation of high-skilled labour',
        '- Scholarships to attract higher-quality overseas students',
        '- Relaxation of immigration policy to target the smarter brains',
        '- Introduction of return migration policy',
        '- any other relevant point',
        '[@2; max: 2. Mark the FIRST point only.]']),
])

MSFIGS.update({
    'ms2017_14': (2017, 11, 132, 154, 462, 390),
    'ms2017_15': (2017, 12, 90, 98, 445, 366),
})

# ------------------------------------------------------------------ 2017
Q(2017, 14, 'E1', [
    ('p', 'Suppose HK ONLINE is the only Internet service provider (ISP) in some private housing estates in Hong Kong. Figure 4 shows the demand for this service.'),
    ('img', 'e2017_14.png', 3.4)], [
    part('(a)', 'E1.1', 5, [
        ('p', '(a) An economist stated that once the Internet network has been installed, the marginal cost of providing the Internet service would be zero.'),
        ('p', '(i) With the aid of Figure 4, explain how HK ONLINE would set a price to maximise its profit under a uniform price arrangement. (4 marks)'),
        ('p', '(ii) Indicate the efficient output level as QE in Figure 4. (1 mark)')], [
        '(a) (i) Illustrated in the diagram:',
        '- Correct position of MR (1)',
        '- Correct position of QM (1)',
        '- Correct position of PM (1)',
        ('img', 'ms2017_14.png', 3.0),
        'Verbal elaboration: HK ONLINE would produce at a quantity where MR = MC = 0. (1)',
        '(ii) - Correct position of QE (1)']),
    part('(b)', 'E1.2', 6, [
        ('p', '(b) Explain whether the following pricing arrangements of HK ONLINE constitute price discrimination.'),
        ('p', '(i) Compared to the existing customers, new customers are charged a lower price for the same service plan. (3 marks)'),
        ('p', '(ii) Internet service subscribers pay less for the same service plan if they also subscribe to the TV service from HK ONLINE. (3 marks)')], [
        '(b) (i) Yes. Different consumers (new and existing customers) are charged different prices for the same services produced under the same cost. (3)',
        '(ii) No. A lower price is charged for the internet service because, when combined with TV service, its marginal cost of production (including administration cost, marketing cost, installation cost, etc.) would be lowered. (3)']),
    part('(c)', 'E1.3', 5, [
        ('p', '(c) It is reported that HK ONLINE colludes with other ISPs. Other firms agree to let HK ONLINE be the sole service provider in some private housing estates. In return, HK ONLINE agrees not to compete with these firms in other estates.'),
        ('p', '(i) Which anti-competitive behaviour are the firms engaged in? List TWO possible motives for the firms. (3 marks)'),
        ('p', '(ii) Which conduct rule of the Competition Ordinance have these ISPs violated in the above case? Explain. (2 marks)')], [
        '(c) (i) Market sharing / market allocation. (1)',
        'Motives:',
        '- Firms would face less competition within their assigned markets.',
        '- They can raise prices and make more profit in their own assigned markets.',
        '- By focusing on their assigned markets alone, firms can lower their marketing cost.',
        '[@1; max: 2. Mark the FIRST TWO motives only.]',
        '(ii) The first conduct rule. Because this is a case of an anti-competitive agreement. (2)']),
])

Q(2017, 15, 'E2', [
    ("p", "Figure 5 shows the production possibility frontier AA' of Country A. PA is the production point when there is no trade. TT' is the world price line of Good X."),
    ('img', 'e2017_15.png', 3.4)], [
    part('(a)', 'E2.1', 6, [
        ('p', '(a) Initially Country A did not engage in international trade.'),
        ('p', '(i) Indicate the consumption point of Country A as CA in Figure 5. Explain your answer. (2 marks)'),
        ('p', '(ii) Show the opportunity cost of producing Good X in Figure 5. Explain whether Country A would have a comparative advantage in producing Good X. (Hint: you may add a straight line at PA.) (4 marks)')], [
        '(a) (i) Illustrated in the diagram: correct position of CA = production point PA (1)',
        'Verbal elaboration: Without trade, Country A can only consume its own production. (1)',
        '(ii) Illustrated in the diagram: correct position of the straight line (L) (1)',
        'Verbal elaboration:',
        '- Slope of L is the marginal cost of Good X. (1)',
        "- L is steeper than TT'. (1)",
        'That means marginal cost of producing Good X is higher than the world price of Good X. (1)',
        'So Country A did not have a comparative advantage in producing Good X. (1)',
        '[max: 3]',
        ('img', 'ms2017_15.png', 3.4)]),
    part('(b)', 'E2.1', 6, [
        ('p', '(b) Country A opens up to international trade.'),
        ('p', '(i) Draw the consumption possibility frontier (CPF) of Country A in Figure 5. Indicate the production point as PT in Figure 5 and explain your answer in terms of marginal cost. (3 marks)'),
        ('p', '(ii) Indicate the consumption point as CT in Figure 5. Why is Country A better off after trade? (2 marks)'),
        ('p', '(iii) Indicate the volume of imports as M in Figure 5. (1 mark)')], [
        '(b) (i) Illustrated in the diagram:',
        '- Correct position of PT (1)',
        '- Correct position of CPF (1)',
        'Verbal elaboration:',
        '- Country A would produce at PT where TOT = domestic marginal cost of production. (1)',
        '(ii) Illustrated in the diagram:',
        '- Correct position of CT (1)',
        'Verbal elaboration:',
        '- Country A can consume at a point which is unattainable from local production before trade. (1)',
        '(iii) Illustrated in the diagram:',
        '- Correct position of M (1)',
        '[Note: knowledge of convex indifference curves is not required.]']),
    part('(c)', 'E2.2', 4, [
        ('p', '(c) The following table shows some data of Country A. Country A opened up to international trade after 2000.'),
        ('table', [['Year', '1990', '2000', '2010'],
                   ['Per-capita real GDP (in US$)', '2 950', '3 000', '3 600'],
                   ['Human development index (HDI)', '0.67', '0.68', '0.68']]),
        ('p', 'With reference to the above table, explain how international trade affects'),
        ('p', '(i) the economic growth of Country A. (2 marks)'),
        ('p', '(ii) the economic development of Country A. (2 marks)')], [
        '(c) (i) - enhance economic growth (as shown by higher levels or positive rates of growth) of per-capita real GDP because (1)',
        'external trade could increase aggregate demand (through exports) and hence real GDP. (1)',
        '(ii) - no change in economic development (as reflected by the same level of HDI) because (1)',
        'more people may leave school earlier in order to take part in trading activities, thus decreasing the average number of years of schooling, while GDP rises as a result of trade. (1)',
        'OR',
        'pollution (as a by-product) may become more serious as production is increased after trade / new disease or virus brought in by foreigners may shorten the life expectancy at birth of the local people. (1)']),
])

MSFIGS.update({
    'ms2018_14': (2018, 12, 135, 262, 505, 545),
    'ms2018_15': (2018, 13, 58, 64, 462, 390),
})

# ------------------------------------------------------------------ 2018
Q(2018, 14, 'E1', [('p', 'The petrol market in Hong Kong is dominated by five oil companies, namely Esso, Shell, Caltex, Sinopec and PetroChina.')], [
    part('(a)', 'E1.3', 3, [('p', '(a) Name ONE anti-competitive behaviour that may be found in the above source. State TWO ways such behaviour may harm consumers. (3 marks)')], [
        '(a) Price fixing. (1)',
        '[Mark the FIRST point only.]',
        'Potential loss to consumers:',
        '- higher price',
        '- lower output',
        '- lack of choices to consumers',
        '- loss in consumer surplus',
        '- (price) competition restricted',
        '- any other relevant point',
        '[@1; max: 2. Mark the FIRST TWO points only.]'],
        pre=[('p', 'Source: adapted from a report by Hong Kong Competition Commission'),
             ('box', ["Same prices are often set across all petrol filling stations even though the stations are owned by different oil companies. Also only the most expensive type of petrol, '98 RON', is sold in the petrol market while other cheaper types of petrol with lower RON are unavailable in Hong Kong."])]),
    part('(b)', 'E1.3', 2, [('p', '(b) Suggest ONE alternative reason to explain the behaviour of the oil companies in the source instead of accusing them of practising anti-competitive behaviour. (2 marks)')], [
        '(b)',
        '- Due to interdependence among firms in an oligopolistic market, whenever a firm changes its prices, all others would follow promptly. As a result, prices set by different firms in the market would end up being the same.',
        '- Strong demand for high-quality petrol products, such as RON 98. This justifies the supply of only one, the most expensive type of petrol.',
        '- any other relevant point',
        '[@2; max: 2. Mark the FIRST point only.]']),
    part('(c)', 'E1.1', 3, [
        ('img', 'e2018_14.png', 3.4),
        ('p', 'Figure 3 shows the demand curve faced by a franchised bus company in Hong Kong. For simplicity, suppose the cost of fuel is the only cost of production and the company adopts uniform pricing.'),
        ('p', '(c) Indicate the profit maximising output level as QM and price as PM in Figure 3. (3 marks)')], [
        '(c) Illustrate in the diagram:',
        'Correct position of MR (1)',
        'Correct position of QM (1)',
        'Correct position of PM (1)']),
    part('(d)', 'E1.1', 3, [
        ('p', 'Suppose all the oil companies increase the price of fuel sharply.'),
        ('p', '(d) Indicate the new price and quantity transacted as P2 and Q2 respectively in Figure 3. Indicate the deadweight loss in Figure 3 after the rise in fuel price. (3 marks)')], [
        '(d) Illustrate in the diagram:',
        'Correct position of MC2 (1)',
        'Correct position of P2 and Q2 (1)',
        'Correct position of DL (1)',
        ('img', 'ms2018_14.png', 3.2)]),
    part('(e)', 'E1.2', 5, [
        ('p', '(e) Case 1: The bus company charges the elderly aged 65 or above $2 per trip.'),
        ('p', 'Case 2: The bus company offers return discount concessions for all passengers.'),
        ('p', 'Does each of the above two cases constitute price discrimination? Explain. (5 marks)')], [
        '(e) Case 1: Yes, because the costs of serving the elderly or non-elderly are the same for the same bus service, but the elderly are being charged a lower fare. (3)',
        '[Note: candidates may argue that public transportation services for the elderly are subsidized by the HK government, so that the bus company has not practised price discrimination.]',
        'Case 2: No, as ALL customers enjoy the same discount and thus face the same pricing strategy, OR the market is not separated. (2)'],
        pre=[('p', 'Figure 3 shows the demand curve faced by a franchised bus company in Hong Kong. For simplicity, suppose the cost of fuel is the only cost of production and the company adopts uniform pricing.')]),
])

Q(2018, 15, 'E2', [
    ('p', 'Figure 4 shows the production possibility frontier (PPFA) of Country A.'),
    ('img', 'e2018_15.png', 3.4),
    ('p', 'Both Country A and its trading partner, Country B, produce Good X and Good Y. Country A has 50 units of resources whereas Country B has 30 units of resources. Country B requires 1 unit of resources to produce 1 unit of Good X and 0.5 units of resources to produce 1 unit of Good Y.')], [
    part('(a)', 'E2.1', 1, [('p', '(a) Draw the production possibility frontier of Country B (PPFB) in Figure 4. (1 mark)')], [
        '(a) Illustrate in the diagram:',
        '- Correct position of production possibility frontier of Country B (PPFB) (1)',
        ('img', 'ms2018_15.png', 3.4)]),
    part('(b)', 'E2.1', 3, [('p', '(b) Explain which country has an absolute advantage in producing Good X. (3 marks)')], [
        '(b) - Country A has absolute advantage in producing Good X. (1)',
        'Any one of the following (@2):',
        '- With the same amount of resources (30 units), Country A can produce a larger quantity of Good X (60 units) than Country B (30 units).',
        '- With the same amount of resources (50 units), Country A can produce a larger quantity of Good X (100 units) than Country B (50 units).',
        '- Country A can produce 1 unit of X with fewer units of resources (0.5 units of resources) than Country B (1 unit of resources).']),
    part('(c)', 'E2.1', 6, [
        ('p', '(c) The two countries trade with each other and the terms of trade is 1X = 1Y. Also, Country B consumes equal amount of Good X and Good Y after trade. In Figure 4, indicate'),
        ('p', '(i) the production point (PB) of Country B after specialisation, (1 mark)'),
        ('p', '(ii) the consumption possibility frontier (CPFB) and consumption point (CB) of Country B after trade and (2 marks)'),
        ('p', '(iii) the consumption possibility frontier (CPFA), the volume of import and the volume of export of Country A. (3 marks)')], [
        '(c) Illustrate in the diagram:',
        '(i) - Correct position of production point of Country B (PB) (1)',
        '(ii) - Correct position of consumption possibility frontier of Country B (CPFB) (1)',
        '- Correct position of consumption point of Country B after trade (CB) (1)',
        '(iii) - Correct position of consumption possibility frontier of Country A (CPFA) (1)',
        '- Correct position of volume of import of Country A (1)',
        '- Correct position of volume of export of Country A (1)']),
    part('(d)', 'E2.2', 6, [
        ("p", "(d) Explain whether the following policies would result in an increase in a country's Human Development Index (HDI)."),
        ('p', '(i) The government closes down environmentally harmful power plants and factories. (3 marks)'),
        ('p', '(ii) The government grants citizenship to all illegal immigrants so that they can stay and work in the country legally. (3 marks)')], [
        '(d) (i) Uncertain, because per capita GNI would fall while life expectancy may rise. (3)',
        '(ii) Uncertain, because while per capita GNI may increase, average year of schooling and/or average life expectancy may drop. (3)']),
])

MSFIGS.update({
    'ms2019_13': (2019, 6, 680, 168, 1075, 503),
    'ms2019_14': (2019, 7, 672, 262, 1080, 630),
})

# ------------------------------------------------------------------ 2019
Q(2019, 13, 'E1', [
    ('p', 'Grape Limited is the only manufacturer of smartphones in a country. It adopts a uniform pricing.'),
    ('img', 'e2019_13.png', 3.6),
    ("p", "Figure 3 shows the market of Grape Limited's smartphones.")], [
    part('(a)', 'E1.1', 4, [('p', '(a) Explain how the profit maximising output and price are determined. Indicate the output and price as Q1 and P1 respectively in Figure 3. (4 marks)')], [
        '(a) Verbal elaboration: Marginal revenue = Marginal cost to determine profit maximising output. The firm will then set the price according to the demand curve. (1)',
        'Illustrate in the diagram: (3)',
        '- correct position of marginal revenue curve',
        '- correct position of Q1',
        '- correct position of P1',
        ('img', 'ms2019_13.png', 3.2)]),
    part('(b)', 'E1.1', 5, [
        ('p', '(b) Technology advance lowers the cost of electronic components of smartphones.'),
        ('p', '(i) Indicate the new output and price as Q2 and P2 respectively in Figure 3.'),
        ('p', '(ii) Discuss the effect of the above change on efficiency with the aid of Figure 3. (5 marks)')], [
        '(b) (i) Illustrate in the diagram: (2)',
        '- downward shift of marginal cost curve',
        '- correct position of P2 and Q2',
        '(ii) Verbal elaboration: Efficiency is worsened because the deadweight loss increases. (1)',
        '[Note: it depends on the new position of the marginal cost curve. Candidates may answer "uncertain" if they can draw the old DL and new DL with similar size.]',
        'Illustrate in the diagram: (2)',
        '- correct position of the old deadweight loss',
        '- correct position of the new deadweight loss']),
    part('(c)', 'E1.2', 4, [
        ('p', '(c) Grape Limited sells its smartphones to students with a 30% discount.'),
        ('p', '(i) Explain why this practice will constitute price discrimination.'),
        ('p', '(ii) Give TWO conditions that this type of price discrimination can be practised. (4 marks)')], [
        '(c) (i) Same products produced at same cost (e.g. smartphones) are charged different prices to different groups of consumers (e.g. students). (2)',
        '(ii) Conditions: (2)',
        '- Market is separable.',
        '- Elasticities of demand of two sub-markets are different.',
        '[Mark the FIRST TWO points only.]']),
    part('(d)', 'E1.3', 3, [('p', '(d) A major smartphone operating system provider, Lemon Corporation, requires any smartphone to pre-install its web browser as a condition of licensing for its operating system. Name the anti-competitive behaviour Lemon Corporation engages in. State TWO ways in which such kind of behaviour will harm the consumers. (3 marks)')], [
        '(d) Tie-in sale. (3)',
        'Harms to consumers:',
        '- higher price',
        '- lack of choice',
        '- any other relevant points',
        '[Mark the FIRST TWO points only.]']),
])

Q(2019, 14, 'E2', [
    ('p', 'Figure 4 shows the production possibilities frontier of Country A (PPFA).'),
    ('img', 'e2019_14.png', 3.4),
    ('p', 'Suppose initially the world price per unit of Good X is 2 units of Good Y.')], [
    part('(a)', 'E2.1', 2, [('p', '(a) Explain which good Country A will export if it engages in international trade. (2 marks)')], [
        '(a) Good X. Because the opportunity cost of producing 1X = 1.5Y < world price (= 2Y). (2)']),
    part('(b)', 'E2.1', 5, [
        ('p', 'Suppose Country A engages in international trade and it always consumes 10 units of Good X.'),
        ('p', '(b) With the aid of Figure 4, calculate the total gain from trade of Country A. (5 marks)')], [
        '(b) Illustrate in the diagram:',
        '- correct position of consumption point before trade C0 (10, 15)',
        '- correct position of production point after trade P1 (20, 0)',
        '- correct position of CPF after trade',
        '- correct position of consumption point after trade C1 (10, 20)',
        'Verbal elaboration: Gain from trade = 5 units of Y',
        '[Note: instead of indicating all the points in the diagram, candidates may also calculate the gain using formula.]']),
    part('(c)', 'E2.1', 2, [
        ('p', 'Suppose Country A engages in international trade and it always consumes 10 units of Good X.'),
        ('p', '(c) Indicate the volume of exports and imports of Country A in Figure 4. (2 marks)')], [
        '(c) Illustrate in the diagram: (2)',
        '- correct position of XA',
        '- correct position of MA',
        ('img', 'ms2019_14.png', 3.0)]),
    part('(d)', 'E2.1', 3, [
        ('p', 'The world price of Good X falls continuously.'),
        ('p', '(d) Explain whether the direction of trade will necessarily remain the same. (3 marks)')], [
        '(d) No. If the world price of Good X falls such that it is lower than the domestic opportunity cost (i.e., 1X < 1.5Y), Country A will no longer have a comparative advantage in producing Good X. (3)']),
    part('(e)', 'E2.2', 2, [
        ('p', 'The leader of Country A decides to adopt a closed-door policy which forbids foreign trade, foreign tourists and foreign workers working in Country A.'),
        ('p', '(e) Explain why economic growth in Country A will worsen. (2 marks)')], [
        '(e) Reasons: (2)',
        '- Closing the door to those foreign workers who possess better knowledge and/or skills than domestic workers would lower the average level of human capital in Country A (and may even reduce its investment in human capital), and thus slow down its output growth.',
        '- Closing the door to foreign trade would eliminate possibilities of importation of better-quality capital (machines and equipment) and superior production technology from foreign countries, and thus create negative effects on technological improvement and output growth in Country A.',
        '- Loss of foreign funding in support of research and development in Country A, thus lowering its rate of technical progress.',
        '- any other relevant point']),
    part('(f)', 'E2.2', 2, [
        ('p', 'The leader of Country A decides to adopt a closed-door policy which forbids foreign trade, foreign tourists and foreign workers working in Country A.'),
        ('p', '(f) Other than the reasons about economic growth, explain why economic development in Country A will worsen. (2 marks)')], [
        '(f) Reasons: (2)',
        '- Health of citizens in Country A may deteriorate due to loss of opportunities to import new and more effective medicine, better-trained doctors, and superior medical equipment and technology from foreign countries.',
        '- Average level of education in Country A may be lowered due to closing down of international schools and departure of foreign teachers (as well as foreign students).',
        '- any other relevant point']),
])

MSFIGS.update({
    'ms2020_12': (2020, 14, 140, 238, 360, 400),
    'ms2020_13': (2020, 15, 95, 255, 420, 495),
})

# ------------------------------------------------------------------ 2020
Q(2020, 12, 'E1', [('p', 'ABC Electricity Limited, the sole supplier of electricity in Country A, adopts uniform pricing.')], [
    part('(a)', 'E1.1', 5, [
        ('p', '(a) If the marginal cost is constant, explain how the profit-maximising output of ABC Electricity Limited will be determined. Indicate the output (QM), the price (PM) and the deadweight loss in Figure 2. (5 marks)'),
        ('img', 'e2020_12.png', 3.0)], [
        '(a) Verbal elaboration: The profit-maximising output is determined by the condition: marginal revenue (MR) = marginal cost (MC). (1)',
        'Illustrate in the diagram:',
        '- horizontal MC (1)',
        '- correct position of MR (1)',
        '- correct position of Qm and Pm (1)',
        '- correct position of DL (1)',
        ('img', 'ms2020_12.png', 2.8)]),
    part('(b)', 'E1.1', 4, [
        ('p', '(b) Suppose the government imposes a lump sum tax, which is a fixed amount regardless of the quantity produced, on ABC Electricity Limited. (Assume that the tax amount is smaller than the profit.)'),
        ('p', '(i) Indicate the after tax profit-maximising output (Qt) and price (Pt) in Figure 2. (2 marks)'),
        ('p', '(ii) Explain whether economic efficiency would worsen as a result of the tax. (2 marks)')], [
        '(b) (i) Illustrate in the diagram:',
        '- correct position of Pt (= Pm) (1)',
        '- correct position of Qt (= Qm) (1)',
        '(ii) No, since imposition of the lump-sum tax would not affect either demand or marginal cost, output and deadweight loss would remain unchanged. (2)']),
    part('(c)', 'E1.2', 3, [('p', '(c) ABC Electricity Limited charges users in the urban area $1 per unit of power consumed and users in the rural area $1.5 per unit of power consumed. Define price discrimination and explain why this price arrangement may NOT constitute price discrimination. (3 marks)')], [
        '(c) Price discrimination is defined as charging different consumers different prices for the same good produced with same costs. In this case, the production cost may not be the same. The installation cost and maintenance cost for rural area might be higher so it may lead to a higher price. (3)']),
    part('(d)', 'E1.3', 4, [
        ('p', 'ABC Electricity Limited planned to install new equipment for electricity supply in the rural area and asked the equipment providers to bid for the contracts. It was found that the two equipment providers in a region agreed to take turns being the bid winner.'),
        ('p', '(d) (i) Which anti-competitive behaviour would the above case constitute? If the above case happened in Hong Kong, which conduct rule of Competition Ordinance would be violated? (2 marks)'),
        ('p', '(ii) State TWO ways the above behaviour would harm ABC Electricity Limited. (2 marks)')], [
        '(d) (i) Bid-rigging. It violated the first conduct rule. (2)',
        '(ii) Harm:',
        '- higher price / cost',
        '- lower quality',
        '- fewer choices',
        '- any other relevant point',
        '[1@; max: 2. Mark the FIRST TWO points only.]']),
])

Q(2020, 13, 'E2', [
    ('p', 'Refer to Figure 3. PPFA and PPFB are the production possibility frontiers of Country A and Country B respectively. E0 is the consumption point of Country A without trade.'),
    ('img', 'e2020_13.png', 3.4),
    ('p', 'Assume the domestic cost of production of 1 unit of Good X in Country A is 1.5 units of Y at E0.')], [
    part('(a)', 'E2.1', 3, [('p', '(a) With reference to the domestic production costs of Country A and Country B, explain which country will specialise in producing Good X. (3 marks)')], [
        '(a) The opportunity cost of producing 1X in Country A = 1.5Y.',
        'The opportunity cost of producing 1X in Country B = 50/100 = 0.5Y.',
        'Since Country B has a lower opportunity cost of producing good X, it would specialise in producing good X. (3)']),
    part('(b)', 'E2.1', 5, [
        ('p', '(b) After Country A engages in trade with Country B, the consumption point of Country A is E1. Indicate in Figure 3,'),
        ('p', '(i) the consumption possibility frontier (CPFA) of Country A (Hint: CPFA should pass through E1),'),
        ('p', '(ii) the production point (AT) of Country A after trade and explain your answer in terms of terms of trade, and'),
        ('p', '(iii) the consumption possibility frontier (CPFB) and the production point (BT) of Country B after trade. (5 marks)')], [
        '(b) Illustrate in the diagram:',
        '- correct position of CPFA (1)',
        '- correct position of AT (1)',
        '- correct position of CPFB (1)',
        '- correct position of BT (1)',
        ('img', 'ms2020_13.png', 3.2),
        'Verbal elaboration: Terms of trade would be equal to the slope of PPFA at point AT (which is the same as the slopes of CPFA and CPFB). (1)']),
    part('(c)', 'E2.2', 8, [
        ('p', '(c) Suppose Country B adopts artificial intelligence technologies in the production of Good Y, which doubles her productivity of the good.'),
        ('p', '(i) Explain whether your answer in part (a) would be affected by the above change. (2 marks)'),
        ('p', '(ii) Give TWO reasons to explain why the adoption of artificial intelligence technologies may boost economic development of Country B. (4 marks)'),
        ('p', '(iii) Apart from adopting artificial intelligence technologies, list TWO factors that may boost economic growth. (2 marks)')], [
        '(c) (i) No. The opportunity cost of producing 1X in Country B would become 1Y, which is still lower than that of Country A. (2)',
        '(ii) Reasons:',
        '- Artificial intelligence technology could increase the per capita GDP as labour becomes more productive with better technology.',
        "- Artificial intelligence technology may improve medicine production and surgery procedures and improve citizens' average life expectancy.",
        '- Artificial intelligence technology may increase the expected average years of schooling with more effective self-learning software and lower the cost of education in the future.',
        '- any other relevant point',
        '[2@; max: 4. Mark the FIRST TWO points only.]',
        '(iii) Factors:',
        '- Subsidise information technology / engineering department in the universities to boost the research and development.',
        '- Provide tax allowances on education to increase the future productivity of labour.',
        '- any other relevant point',
        '[1@; max: 2. Mark the FIRST TWO points only.]']),
])

MSFIGS.update({
    'ms2025_12': (2025, 11, 89, 232, 318, 414),
    'ms2025_13': (2025, 12, 27, 228, 343, 482),
})

# ------------------------------------------------------------------ 2025
Q(2025, 12, 'E1', [('p', 'Airline A is the only airline which operates flights to and from City X. Suppose Airline A adopts uniform pricing.')], [
    part('(a)', 'E1.1', 4, [
        ('p', '(a) Indicate in Figure 2'),
        ('p', '(i) the price and output level of the airline as P0 and Q0 respectively. (2 marks)'),
        ('p', '(ii) the efficient output level as Q1. (1 mark)'),
        ('p', '(iii) the deadweight loss. (1 mark)'),
        ('img', 'e2025_12.png', 3.2)], [
        '(a) (i) Indicate in Figure 2:',
        '- correct position of MR curve (1)',
        '- correct positions of P0 and Q0 (1)',
        '(ii) Indicate in Figure 2: correct position of Q1 (1)',
        '(iii) Indicate in Figure 2: correct position of deadweight loss (1)']),
    part('(b)', 'E1.1', 5, [('p', "(b) Due to an increase in oil price, the efficient output level of Airline A drops to Q0 as in (a)(i). 'Airline A will produce at the efficient output level after the change.' Do you agree? Explain your answer with the aid of Figure 2. (5 marks)")], [
        '(b) Indicate in Figure 2:',
        '- correct position of new MC curve (1)',
        '- correct positions of new monopoly output and efficient output (1)',
        'Verbal elaboration:',
        '- No, because (1)',
        "- as marginal cost increases, both the efficient output and the monopolist's profit-maximising output decrease. (1)",
        '- The new output of the airlines (Q2) is still falling short of the efficient output / at the new output of the airline, the marginal benefit is still higher than the (new) marginal cost. (1)',
        ('img', 'ms2025_12.png', 3.0)]),
    part('(c)', 'E1.2', 3, [
        ('p', '(c) The table below shows some information for flights from City X to City Y operated by Airline A.'),
        ('table', [['Flight details', 'Ticket Price'],
                   ['4:15pm – 7:20pm (3 hours 5 minutes)', '$924'],
                   ['7:35am – 10:25am (2 hours 50 minutes)', '$1 015'],
                   ['1:25pm – 4:20pm (2 hours 55 minutes)', '$1 007']]),
        ('p', 'Based on the above information, explain whether the above pricing arrangement constitutes price discrimination. (3 marks)')], [
        '(c) No, because (1)',
        'the price differences can be explained by product heterogeneity (flights are at different times / with different durations). (2)']),
    part('(d)', 'E1.3', 4, [
        ('p', '(d) In City Y, most airlines raise the prices of air tickets during peak seasons.'),
        ('p', 'A politician: The airlines engage in anti-competitive behaviour in the above situation.'),
        ('p', 'An economist: No, this is merely a response of the airlines to changing market conditions.'),
        ("p", "(i) Explain under what situation the politician's comment is correct. (2 marks)"),
        ("p", "(ii) Give ONE reason to support the economist's comment. (2 marks)")], [
        '(d) (i) The politician is correct if the airlines engage in price-fixing by colluding to raise the prices of air tickets together. (2)',
        '(ii) As the time cost of travelling is generally lower during long holidays, the demand for air tickets is higher during long holidays. The higher prices are merely the result of an increase in the market demand. (2)']),
])

Q(2025, 13, 'E2', [
    ('p', 'Refer to Figure 3. PPFA and PPFB are the production possibility frontiers of Country A and Country B respectively. A0 is the consumption point of Country A without trade.'),
    ('img', 'e2025_13.png', 3.4)], [
    part('(a)', 'E2.1', 2, [('p', '(a) State the change in the marginal cost of producing Good X in Country A when its output of Good X increases. Explain the reason behind. (2 marks)')], [
        '(a) Marginal cost of production is increasing, (1)',
        'because factor inputs are not homogenous / not equally productive in producing Good X and Good Y. (1)']),
    part('(b)', 'E2.1', 2, [
        ('p', 'Suppose the opportunity cost of producing 1 unit of Good X in Country A is 0.5 units of Good Y at A0.'),
        ('p', '(b) Does Country A enjoy a comparative advantage in producing Good X over Country B? Explain your answer. (2 marks)')], [
        '(b) Opportunity cost of producing Good X in Country A at A0 = 0.5Y.',
        'Opportunity cost of producing Good X in Country B = 30/20 = 1.5Y. (1)',
        'As the opportunity cost of producing Good X in Country A is lower than that in Country B, Country A has a comparative advantage in producing Good X. (1)']),
    part('(c)', 'E2.1', 3, [
        ('p', 'The two countries open to international trade and the slope of the dotted line is the world price of Good X.'),
        ('p', '(c) Indicate in Figure 3'),
        ('p', '(i) the production point and the consumption possibility frontier of Country A as PA and CPFA respectively. (2 marks)'),
        ('p', '(ii) the consumption possibility frontier of Country B as CPFB. (1 mark)')], [
        '(c) (i) Indicate in Figure 3:',
        '- Correct position of PA (1)',
        '- Correct position of CPFA (1)',
        '(ii) Indicate in Figure 3:',
        '- Correct position of CPFB (1)']),
    part('(d)', 'E2.1', 3, [
        ('p', '(d) Suppose 10 units of Good X are traded by Country B. Indicate in Figure 3'),
        ('p', '(i) the consumption point of Country B as CB. (1 mark)'),
        ('p', '(ii) the import volume and export volume of Country B. (2 marks)')], [
        '(d) (i) Indicate in Figure 3: correct position of CB (1)',
        '(ii) Indicate in Figure 3:',
        '- export volume = 10 units of Good Y at correct position (1)',
        '- import volume = 10 units of Good X at correct position (1)',
        ('img', 'ms2025_13.png', 3.2)]),
    part('(e)', 'E2.2', 6, [
        ('p', '(e) The government of Country B has changed its policies on human capital. As a result, the productivity of Country B in producing Good Y has increased.'),
        ("p", "(i) Explain whether Country B's direction of trade will be affected. (2 marks)"),
        ('p', '(ii) Explain ONE policy change that may raise the productivity of producing Good Y in Country B. (2 marks)'),
        ("p", "(iii) 'The increase in productivity in Country B does NOT necessarily imply an increase in the Human Development Index in Country B.' Support this statement with ONE reason. Explain your answer. (2 marks)")], [
        "(e) (i) No. An increase in the productivity of Good Y will further reduce Country B's opportunity cost of producing Good Y. Country B's opportunity cost of producing Good Y will remain lower than the terms of trade of Good Y so that the direction of trade is not affected, i.e. Country B will remain as an exporter of Good Y and an importer of Good X. (2)",
        '(ii) Policies:',
        '- increasing tax allowance for further education on the production of Good Y',
        '- increasing grants to vocational training institutions for providing training related to the production of Good Y',
        '- any other relevant point',
        '[2@; max: 2. Mark the FIRST point ONLY.]',
        '(iii) Possible reasons:',
        '- The production of Good Y will lead to more serious pollution. The health of citizens in Country B deteriorates and life expectancy at birth lowers.',
        '- More citizens leave school and work in the production of Good Y. Both the average level of education of citizens in Country B and the expected average years of schooling fall.',
        '- any other relevant point',
        '[2@; max: 2. Mark the FIRST point ONLY.]']),
])
