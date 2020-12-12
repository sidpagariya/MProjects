module.exports = (req, res) => {
  res.status(200).json({
    'FA 2020': {
      start: 'Aug 31 2020',
      end: 'Dec 8 2020'
    },
    'WN 2021': {
      start: 'Jan 19 2021',
      end: 'Apr 21 2021'
    },
  })
}