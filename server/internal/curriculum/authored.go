package curriculum

// authored is the whole hand-written path, in learning order. One slice per
// building so that editing a building means reading one file, and so that no
// file grows past the point where you can hold it in your head.
//
// Learning order is not physical order: 본관 opens with 1F (the ER, where the
// newcomer arrives) and then P1/3F/4F, because that is the order the curricula
// teach in. The client re-sorts a building's floors physically for display —
// see Group — since a browsable list that reads 1F → P1 → 3F → 4F → 8F → 7F
// looks like a bug even when it is the right teaching order.
var authored = func() []Curriculum {
	var all []Curriculum
	for _, b := range [][]Curriculum{mainBuilding, annex1, annex2, annex3, support} {
		all = append(all, b...)
	}
	return all
}()
