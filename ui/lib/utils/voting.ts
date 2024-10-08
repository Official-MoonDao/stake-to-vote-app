import solver from 'javascript-lp-solver'
import _ from 'lodash'

// Function to minimize L1 distance
export function minimizeL1Distance(D, V) {
  const numDistributions = V.length // Number of distributions in V
  const numComponents = D.length // Length of the distributions

  // Initialize variables for the LP problem
  const variables = {}

  // Initialize constraints
  const constraints = {}

  // Constraint: sum of c_i equals 1
  constraints['sum_c'] = { equal: 1 }

  // Constraints: c_i >= 0
  for (let i = 0; i < numDistributions; i++) {
    constraints['c' + i + '_nonneg'] = { min: 0 }
  }

  // Constraints: z_k >= 0
  for (let k = 0; k < numComponents; k++) {
    constraints['z' + k + '_nonneg'] = { min: 0 }
  }

  // Constraints for absolute differences
  for (let k = 0; k < numComponents; k++) {
    // Initialize constraints for each k
    constraints['abs_diff_pos_k' + k] = { max: D[k] }
    constraints['abs_diff_neg_k' + k] = { max: -D[k] }
  }

  // Build variables
  for (let i = 0; i < numDistributions; i++) {
    const variableName = 'c' + i
    variables[variableName] = {
      cost: 0, // c_i does not contribute to the objective function directly
      sum_c: 1, // Coefficient in the sum_c constraint
      ['c' + i + '_nonneg']: 1, // Coefficient in its non-negativity constraint
    }

    // Coefficients in the absolute difference constraints
    for (let k = 0; k < numComponents; k++) {
      const V_ik = V[i][k]
      variables[variableName]['abs_diff_pos_k' + k] = V_ik
      variables[variableName]['abs_diff_neg_k' + k] = -V_ik
    }
  }

  for (let k = 0; k < numComponents; k++) {
    const variableName = 'z' + k
    variables[variableName] = {
      cost: 1, // z_k contributes to the objective function
      ['z' + k + '_nonneg']: 1, // Coefficient in its non-negativity constraint
    }

    // Coefficient in the absolute difference constraints
    variables[variableName]['abs_diff_pos_k' + k] = -1
    variables[variableName]['abs_diff_neg_k' + k] = -1
  }

  // Define the model for the LP solver
  const model = {
    optimize: 'cost',
    opType: 'min',
    constraints: constraints,
    variables: variables,
  }

  // Solve the LP problem
  const results = solver.Solve(model)

  // Extract coefficients c_i from the results
  const coefficients = []
  for (let i = 0; i < numDistributions; i++) {
    coefficients.push(results['c' + i] || 0)
  }
  return coefficients
}

export function iterativeNormalization(distributions, projects) {
  const numProjects = projects.length

  const numVotes = distributions.length
  const votes = Array.from({ length: numVotes }, () =>
    Array(numProjects).fill(NaN)
  )
  for (const [citizenIndex, d] of distributions.entries()) {
    const { address, year, quarter, distribution: dist } = d
    for (const [projectIndex, project] of projects.entries()) {
      const projectId = project.id
      if (projectId in dist) {
        votes[citizenIndex][projectIndex] = dist[projectId]
      }
    }
  }

  let newVotes = []
  let newDistributionSums = []
  for (let loop = 0; loop < 20; loop++) {
    // compute column wise averages
    const projectAverages = []
    for (let j = 0; j < numProjects; j++) {
      let sum = 0
      let count = 0
      for (let i = 0; i < numVotes; i++) {
        if (!isNaN(votes[i][j])) {
          sum += votes[i][j]
          count += 1
        }
      }
      if (count === 0) {
        projectAverages.push(0)
      } else {
        projectAverages.push(sum / count)
      }
    }

    newVotes = _.cloneDeep(votes)
    for (let j = 0; j < numProjects; j++) {
      for (let i = 0; i < numVotes; i++) {
        if (isNaN(newVotes[i][j])) {
          newVotes[i][j] = projectAverages[j]
        }
      }
    }

    newDistributionSums = []
    for (let i = 0; i < numVotes; i++) {
      newDistributionSums.push(_.sum(newVotes[i]))
    }

    for (let j = 0; j < numProjects; j++) {
      for (let i = 0; i < numVotes; i++) {
        if (!isNaN(votes[i][j])) {
          votes[i][j] = (votes[i][j] / newDistributionSums[i]) * 100
        }
      }
    }
  }

  // recreate distributions
  const newDistributions = []
  for (let i = 0; i < numVotes; i++) {
    const distribution = {}
    for (let j = 0; j < numProjects; j++) {
      distribution[projects[j].id] = newVotes[i][j]
    }
    newDistributions.push({
      address: distributions[i].address,
      year: distributions[i].year,
      quarter: distributions[i].quarter,
      distribution,
    })
  }
  return [newDistributions, newVotes]
}
